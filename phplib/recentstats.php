<?php
class RecentStatsCommand {

    public static function execute($payload) {
        if (isset($payload['last_login'])) {
            $result = array(
                'kill' => 0,
                'death' => 0,
                'env_death' => 0,
                'matches' => array(
                    'total' => 0,
                    'win' => 0,
                    'lose' => 0,
                    'draw' => 0
                ),
                'obj' => 0,
                'played_time' => 0,
                'boundary' => 0
            );

            foreach ($payload['matches'] as $match) {
                if ($match['gamemode'] != 'paintball' && $match['gamemode'] != 'splatt' && $match['gamemode'] != 'blitz') {
                    // Kill and death
                    $result['kill'] += $match['kill_count'];
                    $result['death'] += $match['death_count'];
                    $result['env_death'] += $match['envdeath_count'];
                    // Match Result
                    $result['matches']['total']++;
                    $result['matches'][$match['result']]++;
                    // Match Time
                    $playTime = $match['finished']['sec'] - $match['started']['sec'];
                    if ($playTime < 2000) {
                        $result['played_time'] += $playTime;
                    }

                    if($result['boundary'] == 0) {
                        $result['boundary'] = $match['started']['sec'];
                    }
                }
            }

            // objectives
            foreach ($payload['objective']['destroys'] as $destroy) {
                if($destroy['time']['sec'] > $result['boundary']) {
                    $result['obj']++;
                }
            }

            foreach ($payload['objective']['core_leaks'] as $core) {
                if($core['time']['sec'] > $result['boundary']) {
                    $result['obj']++;
                }
            }

            foreach ($payload['ctw']['wool_places'] as $wool) {
                if ($wool['time']['sec'] > $result['boundary']) {
                    $result['obj']++;
                }
            }

            $status = sprintf("%s の直近%d試合の戦績統計\nK: %d D: %d\nK/K: %s K/D: %s\n%sKill/h %sDeath/h %sObj/h\n勝率: %s%% 敗率: %s%%",
                $payload['name'],
                $result['matches']['total'],
                $result['kill'],
                $result['death'],
                self::calculationRatio($result['kill'], $result['death']),
                self::calculationRatio($result['kill'], ($result['death'] + $result['env_death'])),
                self::calculationEfficient($result['kill'], $result['played_time']),
                self::calculationEfficient($result['death'], $result['played_time']),
                self::calculationEfficient($result['obj'], $result['played_time']),
                self::calculationPercent($result['matches']['win'], $result['matches']['lose']),
                self::calculationPercent($result['matches']['lose'], $result['matches']['win'])
            );
            return $status;
        } else {
            return NULL;
        }
    }

    private static function calculationRatio($foo, $bar) {
        if($foo != 0) {
            if($bar == 0) {
                $bar = 1;
            }

            return round($foo / $bar, 3);
        } else {
            return 0;
        }
    }

    private static function calculationEfficient($foo, $time) {
        if ($foo == 0) {
            return 0;
        } else {
            return round($foo * (3600 / $time), 2);
        }
    }

    private static function calculationPercent($foo , $bar) {
        return round($foo / ($foo + $bar) * 100, 1);
    }
}
