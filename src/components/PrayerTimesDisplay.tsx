import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import type { PrayerName } from '@/data/prayerTimes';

export function PrayerTimesDisplay() {
  const { 
    prayerTimes, 
    currentPrayerInfo, 
    formattedDate, 
    formattedTime,
    prayerLabels,
    prayerOrder 
  } = usePrayerTimes();

  if (!prayerTimes) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Laddar bönetider...</div>
      </div>
    );
  }

  const currentLabel = currentPrayerInfo.current 
    ? prayerLabels[currentPrayerInfo.current] 
    : '';
  
  const nextLabel = currentPrayerInfo.next 
    ? prayerLabels[currentPrayerInfo.next] 
    : '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-8">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Header */}
        <header className="text-center space-y-2 opacity-0 animate-fade-in" style={{ animationDelay: '0ms' }}>
          <h1 className="text-3xl font-display font-semibold text-gradient-gold flex items-center justify-center gap-3">
            <span className="text-2xl">🕌</span>
            Odas bönetavla
          </h1>
          <p className="text-muted-foreground text-sm font-body">
            {formattedDate} • {formattedTime}
          </p>
        </header>

        {/* Current Prayer Card */}
        <div 
          className="glass-card rounded-2xl p-6 text-center space-y-4 glow-gold opacity-0 animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm uppercase tracking-wider">Nu</p>
            <p className="text-2xl font-display font-semibold text-foreground flex items-center justify-center gap-2">
              {currentLabel}
              <span className="text-xl">🕌</span>
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs uppercase tracking-wider">Går ut om</p>
            <p className="text-4xl font-body font-light text-primary tracking-wider animate-countdown">
              {currentPrayerInfo.timeRemaining}
            </p>
          </div>
        </div>

        {/* Next Prayer */}
        <div 
          className="glass-card rounded-xl p-4 flex items-center justify-between opacity-0 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">⏳</span>
            <span className="text-muted-foreground text-sm">Nästa:</span>
            <span className="text-foreground font-medium">{nextLabel}</span>
          </div>
          <span className="text-primary font-semibold">{currentPrayerInfo.nextTime}</span>
        </div>

        {/* Prayer Schedule */}
        <div 
          className="glass-card rounded-2xl overflow-hidden opacity-0 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <div className="divide-y divide-border/50">
        {prayerOrder.map((prayer, index) => {
              const time = prayerTimes[prayer];
              const isActive = currentPrayerInfo.current === prayer;
              
              return (
                <div
                  key={prayer}
                  className={`
                    flex items-center justify-between px-5 py-3.5 transition-colors
                    ${isActive ? 'bg-primary/10' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
                    )}
                    {!isActive && (
                      <span className="w-2 h-2" />
                    )}
                    <span className={`
                      font-body
                      ${isActive ? 'text-primary font-medium' : 'text-foreground'}
                      ${prayer === 'sunrise' ? 'text-muted-foreground' : ''}
                    `}>
                      {prayerLabels[prayer]}
                    </span>
                  </div>
                  <span className={`
                    font-body tabular-nums
                    ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}
                  `}>
                    {time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
