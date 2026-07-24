import type { User } from 'firebase/auth';

/**
 * Checks if the current user has permission to update or delete a resource.
 * - Admin: Can manage any resource.
 * - Regular User: Can manage only resources they authored (authorId === user.uid).
 * - Visitor / Unauthenticated: Cannot manage any resource.
 */
export function canManageResource(
  user: User | null,
  isAdmin: boolean,
  authorId?: string
): boolean {
  if (!user) return false;
  if (isAdmin) return true;
  if (!authorId) return false;
  return authorId === user.uid;
}
