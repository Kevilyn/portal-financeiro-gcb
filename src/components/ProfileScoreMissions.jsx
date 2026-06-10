import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle2, Circle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { calculateProfileScore } from '@/lib/profileScore';

const ProfileScoreMissions = ({ user }) => {
  const navigate = useNavigate();
  const profileScore = calculateProfileScore(user);

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <div className={cn('rounded-lg border bg-white p-5 shadow-sm', profileScore.level.border)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700">
              <ShieldCheck className="h-4 w-4 text-[#E31C23]" />
              Score do perfil
            </div>
            <p className="mt-4 text-4xl font-black text-gray-950">{profileScore.score}</p>
            <p className={cn('mt-1 text-sm font-bold', profileScore.level.color)}>
              Perfil {profileScore.level.label}
            </p>
          </div>
          <div className={cn('rounded-lg p-3', profileScore.level.bg)}>
            <Award className={cn('h-6 w-6', profileScore.level.color)} />
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#E31C23] transition-all"
            style={{ width: `${profileScore.score}%` }}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Produtos analisados</p>
            <p className="mt-1 text-lg font-bold text-gray-950">{profileScore.productsAnalyzed}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Missoes concluidas</p>
            <p className="mt-1 text-lg font-bold text-gray-950">
              {profileScore.completedMissions}/{profileScore.totalMissions}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {profileScore.drivers.map((driver) => (
            <span key={driver} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
              {driver}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#E31C23]">
              <Award className="h-4 w-4" />
              Missoes da jornada
            </div>
            <h2 className="mt-3 text-xl font-bold text-gray-950">Próximos passos recomendados</h2>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {profileScore.missions.map((mission) => (
            <div key={mission.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                {mission.completed ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-gray-300" />
                )}
                <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-gray-600">
                  +{mission.points} pts
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-950">{mission.title}</h3>
              <p className="mt-2 min-h-[54px] text-xs text-gray-600">{mission.description}</p>
              <Button
                variant={mission.completed ? 'outline' : 'default'}
                size="sm"
                disabled={mission.completed}
                onClick={() => navigate(mission.path)}
                className={cn(
                  'mt-4 w-full',
                  mission.completed ? 'border-green-200 text-green-700' : 'bg-[#E31C23] text-white hover:bg-[#c41a1f]'
                )}
              >
                {mission.cta}
                {!mission.completed && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileScoreMissions;
