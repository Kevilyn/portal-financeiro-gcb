import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet';
import { User, MapPin, Save, X, Edit2, Shield, Loader2, Bell, Clock, LayoutDashboard, Mail, Phone, Building, Hash } from 'lucide-react';

// New Components
import NotificationsCard from '@/components/NotificationsCard';
import ActivityTimeline from '@/components/ActivityTimeline';
import ActivityFilter from '@/components/ActivityFilter';
import ProfileUpdateStatus from '@/components/ProfileUpdateStatus';

const DashboardPerfil = () => {
  const { user, updateUserProfile, markNotificationAsRead, archiveNotification } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dados");
  const [activityFilter, setActivityFilter] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(5);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    referencia: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        cep: user.detalhesEndereco?.cep || '',
        endereco: user.detalhesEndereco?.logradouro || '',
        numero: user.detalhesEndereco?.numero || '',
        complemento: user.detalhesEndereco?.complemento || '',
        bairro: user.detalhesEndereco?.bairro || '',
        cidade: user.detalhesEndereco?.cidade || '',
        estado: user.detalhesEndereco?.estado || '',
        referencia: user.detalhesEndereco?.referencia || ''
      });
    }
  }, [user]);

  const filteredActivities = useMemo(() => {
    if (!user || !user.activities) return [];
    let filtered = user.activities;
    if (activityFilter !== 'all') {
        filtered = filtered.filter(a => a.type === activityFilter);
    }
    return filtered;
  }, [user, activityFilter]);

  const visibleActivities = filteredActivities.slice(0, displayLimit);
  const hasMoreActivities = filteredActivities.length > displayLimit;

  const activeNotifications = useMemo(() => {
    if (!user || !user.notifications) return [];
    return user.notifications.filter(n => !n.archived);
  }, [user]);

  const unreadCount = activeNotifications.filter(n => !n.read).length;

  const handleLoadMoreActivities = () => {
    setDisplayLimit(prev => prev + 5);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cep') {
      formattedValue = value.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
    }
    if (name === 'telefone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11)
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleFetchAddress = async () => {
    const cleanCep = formData.cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }));
        toast({ title: "Endereço encontrado!" });
      } else {
        toast({ title: "CEP não encontrado", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao buscar CEP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
        setFormData({
            nome: user.nome || '',
            email: user.email || '',
            telefone: user.telefone || '',
            cep: user.detalhesEndereco?.cep || '',
            endereco: user.detalhesEndereco?.logradouro || '',
            numero: user.detalhesEndereco?.numero || '',
            complemento: user.detalhesEndereco?.complemento || '',
            bairro: user.detalhesEndereco?.bairro || '',
            cidade: user.detalhesEndereco?.cidade || '',
            estado: user.detalhesEndereco?.estado || '',
            referencia: user.detalhesEndereco?.referencia || ''
        });
    }
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!formData.nome.trim() || !formData.email.trim() || !formData.telefone.trim()) {
        toast({ title: "Erro", description: "Nome, Email e Telefone são obrigatórios.", variant: "destructive" });
        return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const enderecoCompleto = `${formData.endereco}, ${formData.numero}${formData.complemento ? ' ' + formData.complemento : ''}`;

    const updates = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        endereco: enderecoCompleto,
        detalhesEndereco: {
            cep: formData.cep,
            logradouro: formData.endereco,
            numero: formData.numero,
            complemento: formData.complemento,
            bairro: formData.bairro,
            cidade: formData.cidade,
            estado: formData.estado,
            referencia: formData.referencia
        },
        lastProfileSync: new Date().toISOString()
    };

    const success = updateUserProfile(updates);

    if (success) {
        toast({ title: "Sucesso!", description: "Perfil atualizado com sucesso.", className: "bg-green-100 border-green-500" });
        setIsEditing(false);
    } else {
        toast({ title: "Erro", description: "Não foi possível salvar as alterações.", variant: "destructive" });
    }
    setLoading(false);
  };

  // Helper for Input with Icon
  const ProfileInput = ({ icon: Icon, disabled, className, ...props }) => (
    <div className={`flex items-center border rounded-md overflow-hidden transition-all bg-white ${disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500'}`}>
        <div className={`pl-3 pr-2 flex items-center h-full ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            <Icon className="w-4 h-4" />
        </div>
        <input 
            {...props}
            disabled={disabled}
            className={`w-full py-2 px-2 text-sm outline-none border-none bg-transparent ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-900 placeholder:text-gray-400'}`}
        />
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <Helmet>
        <title>Meu Perfil | Portal de Negociação</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-500">Gerencie seus dados pessoais, endereço e notificações</p>
        </div>
        
        {activeTab === 'dados' && !isEditing && (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 shadow-md">
                <Edit2 className="w-4 h-4 mr-2" /> Editar Dados
            </Button>
        )}
        
        {activeTab === 'dados' && isEditing && (
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={loading}>
                    <X className="w-4 h-4 mr-2" /> Cancelar
                </Button>
                <Button onClick={handleSaveProfile} disabled={loading} className="bg-green-600 hover:bg-green-700 shadow-md">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} 
                    Salvar Alterações
                </Button>
            </div>
        )}
      </div>

      <ProfileUpdateStatus lastUpdate={user?.lastProfileSync} />

      <Tabs defaultValue="dados" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-gray-100/80 p-1 rounded-xl">
          <TabsTrigger value="dados" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            <User className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Meu Cadastro</span>
            <span className="md:hidden">Cadastro</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            <div className="relative">
                 <Bell className="w-4 h-4 mr-2 inline-block" />
                 {unreadCount > 0 && (
                     <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                 )}
            </div>
            <span className="hidden md:inline">Notificações</span>
            <span className="md:hidden">Alertas</span>
          </TabsTrigger>
          <TabsTrigger value="historico" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            <Clock className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Histórico de Atividades</span>
            <span className="md:hidden">Histórico</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Personal Data Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b">
                        <LayoutDashboard className="w-5 h-5 text-blue-600" /> Dados Pessoais
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <Label className="text-gray-600 text-sm">CPF</Label>
                            <ProfileInput 
                                icon={Shield}
                                value={user?.cpf || ''} 
                                disabled
                            />
                        </div>

                        <div>
                            <Label className="text-gray-700">Nome Completo</Label>
                            <ProfileInput 
                                icon={User}
                                name="nome"
                                value={formData.nome} 
                                onChange={handleInputChange} 
                                disabled={!isEditing}
                            />
                        </div>

                        <div>
                            <Label className="text-gray-700">E-mail</Label>
                            <ProfileInput 
                                icon={Mail}
                                name="email"
                                type="email"
                                value={formData.email} 
                                onChange={handleInputChange} 
                                disabled={!isEditing}
                            />
                        </div>

                        <div>
                            <Label className="text-gray-700">Telefone Celular</Label>
                            <ProfileInput 
                                icon={Phone}
                                name="telefone"
                                value={formData.telefone} 
                                onChange={handleInputChange} 
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>

                {/* Address Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b">
                        <MapPin className="w-5 h-5 text-blue-600" /> Endereço
                    </h2>

                    <div className="space-y-4">
                        <div className="flex gap-2 items-end">
                            <div className="flex-1">
                                <Label className="text-gray-700">CEP</Label>
                                <ProfileInput 
                                    icon={MapPin}
                                    name="cep"
                                    value={formData.cep} 
                                    onChange={handleInputChange} 
                                    disabled={!isEditing}
                                />
                            </div>
                            {isEditing && (
                                <Button 
                                    type="button" 
                                    onClick={handleFetchAddress}
                                    variant="outline"
                                    className="mb-[1px]"
                                    disabled={formData.cep.length < 9}
                                >
                                Buscar
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <Label className="text-gray-700">Endereço</Label>
                                <ProfileInput 
                                    icon={Building}
                                    name="endereco"
                                    value={formData.endereco} 
                                    onChange={handleInputChange} 
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label className="text-gray-700">Número</Label>
                                <ProfileInput 
                                    icon={Hash}
                                    name="numero"
                                    value={formData.numero} 
                                    onChange={handleInputChange} 
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-700">Complemento</Label>
                                <ProfileInput 
                                    icon={Building}
                                    name="complemento"
                                    value={formData.complemento} 
                                    onChange={handleInputChange} 
                                    disabled={!isEditing}
                                    placeholder="Ex: Apto 101"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-700">Bairro</Label>
                                <ProfileInput 
                                    icon={MapPin}
                                    name="bairro"
                                    value={formData.bairro} 
                                    onChange={handleInputChange} 
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-700">Cidade</Label>
                                <ProfileInput 
                                    icon={MapPin}
                                    name="cidade"
                                    value={formData.cidade} 
                                    readOnly 
                                    disabled
                                />
                            </div>
                            <div>
                                <Label className="text-gray-700">Estado</Label>
                                <ProfileInput 
                                    icon={MapPin}
                                    name="estado"
                                    value={formData.estado} 
                                    readOnly 
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TabsContent>

        <TabsContent value="notificacoes" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-600" /> Central de Notificações
                    </h2>
                    {unreadCount > 0 && (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                            {unreadCount} novas
                        </span>
                    )}
                </div>
                
                <NotificationsCard 
                    notifications={activeNotifications} 
                    onMarkRead={markNotificationAsRead}
                    onArchive={archiveNotification}
                />
            </div>
        </TabsContent>

        <TabsContent value="historico" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b">
                    <Clock className="w-5 h-5 text-blue-600" /> Histórico de Atividades
                </h2>
                
                <ActivityFilter 
                    currentFilter={activityFilter} 
                    onFilterChange={setActivityFilter} 
                />
                
                <ActivityTimeline 
                    activities={visibleActivities}
                    loading={false}
                    hasMore={hasMoreActivities}
                    onLoadMore={handleLoadMoreActivities}
                />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPerfil;