export type AthleteLevel = 'beginner' | 'intermediate' | 'scaled' | 'rx';

export type AchievementStatus = 'submitted' | 'approved' | 'rejected';

export type ChallengeCategory =
  | 'custom_metcon_reps'
  | 'power_lifting';

export type ResultFormat = 'rx' | 'scaled';
export type RankingResultFormat = ResultFormat | 'mixed';

export type Athlete = {
  id: string;
  fullName: string;
  level: AthleteLevel;
  city: string;
  favoriteFocus: string;
  points: number;
  achievementsApproved: number;
  avatarColor: string;
  tagline: string;
};

export type Challenge = {
  id: string;
  title: string;
  category: ChallengeCategory;
  summary: string;
  startDate: string;
  endDate: string;
  youtubeUrl: string;
  totalReps: number;
  isActive: boolean;
};

export type RankingEntry = {
  athleteId: string;
  athleteName: string;
  level: AthleteLevel;
  rank: number;
  points: number;
  resultFormat: RankingResultFormat;
  delta: number;
  approvedAchievements: number;
  challengeId?: string | null;
  challengeTitle?: string | null;
  challengeEndDate?: string | null;
  completed?: boolean;
  timeSeconds?: number | null;
  repsCompleted?: number | null;
  isFinalized?: boolean;
  rankingView?: 'event' | 'challenge';
  wodsScored?: number;
};

export type Achievement = {
  id: string;
  athleteId: string;
  challengeId: string;
  title: string;
  status: AchievementStatus;
  achievementDate: string;
  pointsAwarded: number;
  completed: boolean;
  resultFormat: ResultFormat;
  timeSeconds: number | null;
  repsCompleted: number | null;
  weightLbs?: number | null;
  tieBreakOrder?: number | null;
  rankPoints: number | null;
};

export type DashboardSummary = {
  totalAthletes: number;
  totalChallenges: number;
  totalAchievements: number;
  leaderboardLeader: string;
};

export type AthleteProfile = {
  athleteId: string;
  fullName: string;
  email: string;
  level: AthleteLevel;
  city: string;
  boxName: string;
  favoriteFocus: string;
  goals: string;
  bio: string;
  joinedAt: string;
};

export type BaselinePR = {
  id: string;
  movementId: string;
  movement: string;
  unit: 'lb' | 'kg' | 'reps';
  value: number;
};

export type BaselineSkill = {
  id: string;
  skillId: string;
  name: string;
  status: 'not_started' | 'developing' | 'consistent' | 'mastered';
};

export type BaselineEntry = {
  id: string | null;
  itemId: string;
  name: string;
  category:
    | 'weightlifting'
    | 'wod'
    | 'gymnastics'
    | 'skill'
    | 'strength'
    | 'conditioning'
    | 'other';
  metricType: 'weight' | 'time' | 'reps' | 'distance' | 'score' | 'status';
  unit: 'lb' | 'kg' | 'seconds' | 'reps' | 'meters' | 'points' | 'status';
  description: string;
  value: number | null;
  status: BaselineSkill['status'];
  notes: string;
};

export type BaselineCatalogItem = {
  id: string;
  name: string;
  category: BaselineEntry['category'];
  metricType: BaselineEntry['metricType'];
  unit: BaselineEntry['unit'];
  description: string;
  isActive: boolean;
};

export type AthleteBaseline = {
  athleteId: string;
  locked: boolean;
  prs: BaselinePR[];
  skills: BaselineSkill[];
  entries: BaselineEntry[];
};

export type DashboardKPI = {
  id: string;
  label: string;
  value: string;
  tone: 'primary' | 'secondary' | 'neutral';
};

export type AthleteDashboard = {
  athlete: Athlete;
  rank: RankingEntry;
  kpis: DashboardKPI[];
  activeChallenges: Challenge[];
  recentAchievements: Achievement[];
};

export type CoachProfile = {
  id: string;
  fullName: string;
  email: string;
  boxName: string;
};

export type CoachDashboard = {
  coach: CoachProfile;
  kpis: DashboardKPI[];
  pendingApprovals: PendingAchievementReview[];
  topAthletes: RankingEntry[];
};

export type PendingAchievementReview = Achievement & {
  athleteName: string;
  notes: string;
};

export type ChallengeManagementItem = Challenge;

export type NavItem = {
  label: string;
  href: string;
};
