import {
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

// ─── In-memory data store ──────────────────────────────────────────────────────
let users: User[] = [
  {
    id: '1',
    username: 'alice.kamau',
    firstName: 'Alice',
    lastName: 'Kamau',
    email: 'alice.kamau@kcbgroup.com',
    phone: '+254701234567',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    username: 'brian.otieno',
    firstName: 'Brian',
    lastName: 'Otieno',
    email: 'brian.otieno@kcbgroup.com',
    phone: '+254712345678',
    role: 'Manager',
    status: 'Active',
    createdAt: '2024-02-20T09:00:00Z',
  },
  {
    id: '3',
    username: 'catherine.mwangi',
    firstName: 'Catherine',
    lastName: 'Mwangi',
    email: 'catherine.mwangi@kcbgroup.com',
    phone: '+254723456789',
    role: 'User',
    status: 'Active',
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    id: '4',
    username: 'david.njoroge',
    firstName: 'David',
    lastName: 'Njoroge',
    email: 'david.njoroge@kcbgroup.com',
    phone: '+254734567890',
    role: 'Manager',
    status: 'Inactive',
    createdAt: '2024-03-15T11:00:00Z',
  },
  {
    id: '5',
    username: 'eleanor.achieng',
    firstName: 'Eleanor',
    lastName: 'Achieng',
    email: 'eleanor.achieng@kcbgroup.com',
    phone: '+254745678901',
    role: 'User',
    status: 'Active',
    createdAt: '2024-04-01T12:00:00Z',
  },
  {
    id: '6',
    username: 'felix.kiprotich',
    firstName: 'Felix',
    lastName: 'Kiprotich',
    email: 'felix.kiprotich@kcbgroup.com',
    phone: '+254756789012',
    role: 'User',
    status: 'Active',
    createdAt: '2024-04-10T13:00:00Z',
  },
  {
    id: '7',
    username: 'grace.wanjiru',
    firstName: 'Grace',
    lastName: 'Wanjiru',
    email: 'grace.wanjiru@kcbgroup.com',
    phone: '+254767890123',
    role: 'Manager',
    status: 'Active',
    createdAt: '2024-05-05T14:00:00Z',
  },
  {
    id: '8',
    username: 'hassan.abdalla',
    firstName: 'Hassan',
    lastName: 'Abdalla',
    email: 'hassan.abdalla@kcbgroup.com',
    phone: '+254778901234',
    role: 'User',
    status: 'Inactive',
    createdAt: '2024-05-20T15:00:00Z',
  },
  {
    id: '9',
    username: 'irene.muturi',
    firstName: 'Irene',
    lastName: 'Muturi',
    email: 'irene.muturi@kcbgroup.com',
    phone: '+254789012345',
    role: 'User',
    status: 'Active',
    createdAt: '2024-06-01T16:00:00Z',
  },
  {
    id: '10',
    username: 'james.odhiambo',
    firstName: 'James',
    lastName: 'Odhiambo',
    email: 'james.odhiambo@kcbgroup.com',
    phone: '+254790123456',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-06-15T17:00:00Z',
  },
  {
    id: '11',
    username: 'kenda.cheptoo',
    firstName: 'Kenda',
    lastName: 'Cheptoo',
    email: 'kenda.cheptoo@kcbgroup.com',
    phone: '+254700111222',
    role: 'User',
    status: 'Active',
    createdAt: '2024-07-01T08:00:00Z',
  },
  {
    id: '12',
    username: 'laban.mutua',
    firstName: 'Laban',
    lastName: 'Mutua',
    email: 'laban.mutua@kcbgroup.com',
    phone: '+254711222333',
    role: 'Manager',
    status: 'Active',
    createdAt: '2024-07-10T09:00:00Z',
  },
  {
    id: '13',
    username: 'mary.waweru',
    firstName: 'Mary',
    lastName: 'Waweru',
    email: 'mary.waweru@kcbgroup.com',
    phone: '+254722333444',
    role: 'User',
    status: 'Active',
    createdAt: '2024-07-20T10:00:00Z',
  },
  {
    id: '14',
    username: 'nathan.korir',
    firstName: 'Nathan',
    lastName: 'Korir',
    email: 'nathan.korir@kcbgroup.com',
    phone: '+254733444555',
    role: 'User',
    status: 'Inactive',
    createdAt: '2024-08-01T11:00:00Z',
  },
  {
    id: '15',
    username: 'olivia.ndungu',
    firstName: 'Olivia',
    lastName: 'Ndungu',
    email: 'olivia.ndungu@kcbgroup.com',
    phone: '+254744555666',
    role: 'Manager',
    status: 'Active',
    createdAt: '2024-08-15T12:00:00Z',
  },
  {
    id: '16',
    username: 'peter.langat',
    firstName: 'Peter',
    lastName: 'Langat',
    email: 'peter.langat@kcbgroup.com',
    phone: '+254755666777',
    role: 'User',
    status: 'Active',
    createdAt: '2024-09-01T13:00:00Z',
  },
  {
    id: '17',
    username: 'queen.adhiambo',
    firstName: 'Queen',
    lastName: 'Adhiambo',
    email: 'queen.adhiambo@kcbgroup.com',
    phone: '+254766777888',
    role: 'User',
    status: 'Active',
    createdAt: '2024-09-10T14:00:00Z',
  },
  {
    id: '18',
    username: 'ruth.kariuki',
    firstName: 'Ruth',
    lastName: 'Kariuki',
    email: 'ruth.kariuki@kcbgroup.com',
    phone: '+254777888999',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-09-20T15:00:00Z',
  },
  {
    id: '19',
    username: 'samuel.barasa',
    firstName: 'Samuel',
    lastName: 'Barasa',
    email: 'samuel.barasa@kcbgroup.com',
    phone: '+254788999000',
    role: 'Manager',
    status: 'Inactive',
    createdAt: '2024-10-01T16:00:00Z',
  },
  {
    id: '20',
    username: 'tabitha.onyango',
    firstName: 'Tabitha',
    lastName: 'Onyango',
    email: 'tabitha.onyango@kcbgroup.com',
    phone: '+254799000111',
    role: 'User',
    status: 'Active',
    createdAt: '2024-10-10T08:00:00Z',
  },
  {
    id: '21',
    username: 'usman.farah',
    firstName: 'Usman',
    lastName: 'Farah',
    email: 'usman.farah@kcbgroup.com',
    phone: '+254700222333',
    role: 'User',
    status: 'Active',
    createdAt: '2024-10-20T09:00:00Z',
  },
  {
    id: '22',
    username: 'violet.cherop',
    firstName: 'Violet',
    lastName: 'Cherop',
    email: 'violet.cherop@kcbgroup.com',
    phone: '+254711333444',
    role: 'Manager',
    status: 'Active',
    createdAt: '2024-11-01T10:00:00Z',
  },
  {
    id: '23',
    username: 'william.kimani',
    firstName: 'William',
    lastName: 'Kimani',
    email: 'william.kimani@kcbgroup.com',
    phone: '+254722444555',
    role: 'User',
    status: 'Inactive',
    createdAt: '2024-11-10T11:00:00Z',
  },
  {
    id: '24',
    username: 'xavier.ouko',
    firstName: 'Xavier',
    lastName: 'Ouko',
    email: 'xavier.ouko@kcbgroup.com',
    phone: '+254733555666',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-11-20T12:00:00Z',
  },
  {
    id: '25',
    username: 'yvonne.gitau',
    firstName: 'Yvonne',
    lastName: 'Gitau',
    email: 'yvonne.gitau@kcbgroup.com',
    phone: '+254744666777',
    role: 'User',
    status: 'Active',
    createdAt: '2024-12-01T13:00:00Z',
  },
];
let nextId = 26;

// ─── Credentials ──────────────────────────────────────────────────────────────
const VALID_CREDENTIALS: Record<string, string> = {
  admin: 'admin123',
};

// ─── JWT simulation ───────────────────────────────────────────────────────────
function generateToken(username: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: username,
      role: 'Admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  );
  const signature = btoa(`${header}.${payload}.kcb-secret`);
  return `${header}.${payload}.${signature}`;
}

function generateRefreshToken(username: string): string {
  const payload = btoa(
    JSON.stringify({
      sub: username,
      type: 'refresh',
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 h
    }),
  );
  return `refresh.${payload}.kcb-refresh-secret`;
}

function parseRefreshToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || parts[0] !== 'refresh') return null;
    const payload = JSON.parse(atob(parts[1])) as { sub: string; type: string; exp: number };
    if (payload.type !== 'refresh' || Date.now() / 1000 > payload.exp) return null;
    return payload.sub;
  } catch {
    return null;
  }
}

function verifyToken(req: HttpRequest<unknown>): boolean {
  const authHeader = req.headers.get('Authorization');
  return !!(authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 30);
}

// ─── Delay config (ms) ───────────────────────────────────────────────────────
const DELAYS = {
  login: 800, // auth feels slower — network + token issuance
  list: 900, // loading many records — triggers skeleton loader
  get: 500, // single record fetch
  create: 700, // write operation — shows saving spinner
  update: 700, // write operation — shows saving spinner
  delete: 600, // delete — slightly faster
  error: 400, // errors resolve quickly
} as const;

// ─── Response helpers ─────────────────────────────────────────────────────────
function ok(body: unknown, status = 200, ms = 500) {
  return of(new HttpResponse({ status, body })).pipe(delay(ms));
}

function err(message: string, status: number, ms: number = DELAYS.error) {
  return throwError(() => new HttpErrorResponse({ status, error: { message } })).pipe(delay(ms));
}

// ─── Interceptor ──────────────────────────────────────────────────────────────
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  // In production, skip mock entirely and pass to a real API
  if (!environment.useMockApi) {
    return next(req);
  }

  const url = req.url;
  const method = req.method;

  // POST /api/auth/login
  if (url === '/api/auth/login' && method === 'POST') {
    const body = req.body as { username: string; password: string };
    if (VALID_CREDENTIALS[body?.username] === body?.password) {
      return ok(
        {
          token: generateToken(body.username),
          refreshToken: generateRefreshToken(body.username),
          user: { id: '0', username: body.username, role: 'Admin' },
          message: 'Login successful',
        },
        200,
        DELAYS.login,
      );
    }
    return err('Invalid username or password', 401, DELAYS.login);
  }

  // POST /api/auth/refresh
  if (url === '/api/auth/refresh' && method === 'POST') {
    const body = req.body as { refreshToken: string };
    const username = parseRefreshToken(body?.refreshToken);
    if (!username) return err('Invalid or expired refresh token', 401, DELAYS.error);
    return ok(
      {
        token: generateToken(username),
        refreshToken: generateRefreshToken(username),
      },
      200,
      300,
    );
  }

  // Auth guard for all other /api/ routes
  if (url.startsWith('/api/') && !verifyToken(req)) {
    return err('Unauthorized. Please log in.', 401);
  }

  // GET /api/users  (list with optional search + pagination)
  if (url === '/api/users' && method === 'GET') {
    const search = (req.params.get('search') || '').toLowerCase().trim();
    const page = Math.max(1, Number(req.params.get('page') || '1'));
    const pageSize = Math.max(1, Number(req.params.get('pageSize') || '10'));

    const filtered = search
      ? users.filter(
          (u) =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(search) ||
            u.username.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search) ||
            u.role.toLowerCase().includes(search) ||
            u.phone.includes(search),
        )
      : [...users];

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return ok(
      {
        data: paginated,
        total,
        totalActive: users.filter((u) => u.status === 'Active').length,
        totalInactive: users.filter((u) => u.status === 'Inactive').length,
        totalAdmins: users.filter((u) => u.role === 'Admin').length,
        page,
        pageSize,
        message: 'Users retrieved successfully',
      },
      200,
      DELAYS.list,
    );
  }

  // POST /api/users  (create)
  if (url === '/api/users' && method === 'POST') {
    const body = req.body as Omit<User, 'id' | 'createdAt'>;
    if (users.some((u) => u.email === body.email))
      return err('A user with this email already exists.', 409, DELAYS.create);
    if (users.some((u) => u.phone === body.phone))
      return err('A user with this phone number already exists.', 409, DELAYS.create);
    const username =
      body.username || `${body.firstName.toLowerCase()}.${body.lastName.toLowerCase()}`;
    const newUser: User = {
      ...body,
      username,
      id: String(nextId++),
      createdAt: new Date().toISOString(),
    };
    users = [...users, newUser];
    return ok({ data: newUser, message: 'User created successfully' }, 201, DELAYS.create);
  }

  // Match /api/users/:id  routes
  const idMatch = url.match(/^\/api\/users\/([^/?]+)$/);
  if (idMatch) {
    const id = idMatch[1];

    // GET /api/users/:id
    if (method === 'GET') {
      const user = users.find((u) => u.id === id);
      if (!user) return err('User not found', 404);
      return ok({ data: user, message: 'User retrieved successfully' }, 200, DELAYS.get);
    }

    // PUT /api/users/:id
    if (method === 'PUT') {
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return err('User not found', 404);
      const body = req.body as Partial<User>;
      if (body.email && users.some((u) => u.email === body.email && u.id !== id))
        return err('A user with this email already exists.', 409, DELAYS.update);
      if (body.phone && users.some((u) => u.phone === body.phone && u.id !== id))
        return err('A user with this phone number already exists.', 409, DELAYS.update);
      users[idx] = { ...users[idx], ...body };
      return ok({ data: users[idx], message: 'User updated successfully' }, 200, DELAYS.update);
    }

    // DELETE /api/users/:id
    if (method === 'DELETE') {
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return err('User not found', 404);
      const deleted = users[idx];
      users = users.filter((u) => u.id !== id);
      return ok({ data: deleted, message: 'User deleted successfully' }, 200, DELAYS.delete);
    }
  }

  return next(req);
};
