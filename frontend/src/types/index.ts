export type AthleteLevel = 'beginner' | 'intermediate' | 'scaled' | 'rx';

export type AchievementStatus = 'submitted' | 'approved' | 'rejected';

export type ChallengeCategory = 'strength' | 'gymnastics' | 'conditioning' | 'consistency';

export type Athlete = {
  id: string;
  fullName: string;
  level: AthleteLevel;
  city: string;
  favoriteFocus: string;
  points: number;
  attendanceRate: number;
  achievementsApproved: number;
  streakDays: number;
  avatarColor: string;
  tagline: string;
};

export type Challenge = {
  id: string;
  title: string;
  category: ChallengeCategory;
  points: number;
  difficulty: 'starter' | 'builder' | 'beast';
  summary: string;
  windowLabel: string;
};

export type RankingEntry = {
  athleteId: string;
  athleteName: string;
  level: AthleteLevel;
  rank: number;
  points: number;
  delta: number;
  attendanceRate: number;
  approvedAchievements: number;
};

export type Achievement = {
  id: string;
  athleteId: string;
  challengeId: string;
  title: string;
  status: AchievementStatus;
  achievementDate: string;
  pointsAwarded: number;
};

export type Attendance = {
  id: string;
  athleteId: string;
  sessionDate: string;
  checkedIn: boolean;
};

export type DashboardSummary = {
  totalAthletes: number;
  totalChallenges: number;
  totalAchievements: number;
  totalAttendanceRecords: number;
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

export type AthleteBaseline = {
  athleteId: string;
  locked: boolean;
  prs: BaselinePR[];
  skills: BaselineSkill[];
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
  todayAttendance: AttendanceSessionRecord[];
  topAthletes: RankingEntry[];
};

export type AttendanceSessionRecord = {
  id: string;
  sessionDate: string;
  title: string;
  checkedInCount: number;
  totalExpected: number;
};

export type PendingAchievementReview = Achievement & {
  athleteName: string;
  notes: string;
};

export type ChallengeManagementItem = Challenge & {
  isActive: boolean;
};

export type NavItem = {
  label: string;
  href: string;
};
