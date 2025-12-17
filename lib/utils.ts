export function getUserId(): string {
  if (typeof window === 'undefined') {
    return 'server_user';
  }

  let userId = localStorage.getItem('krishna_user_id');

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('krishna_user_id', userId);
  }

  return userId;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

