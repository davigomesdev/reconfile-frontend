import { RoleEnum } from '../enums/role.enum';
import { AccessLevelEnum } from '../enums/access-level.enum';

import { IStore } from './store.interface';
import { IFranchise } from './franchise.interface';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  token: string | null;
  confirmed: boolean;
  accessLevel: AccessLevelEnum;
  roles: RoleEnum[];
  motorcycleAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  store?: IStore;
  franchise?: IFranchise;
}
