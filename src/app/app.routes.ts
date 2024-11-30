import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RoutineCreationComponent } from './routine/routine-creation/routine-creation.component';
import { InitComponent } from './init/init.component';
import { CustomerListComponent } from './lists/customer-list/customer-list.component';
import { RoutineListComponent } from './routine/routine-list/routine-list.component';
import { TeacherListComponent } from './lists/teacher-list/teacher-list.component';
import { AdminListComponent } from './lists/admin-list/admin-list.component';
import { UserRegisterComponent } from './lists/user-register/user-register.component';
import { authGuard } from './guards/auth-guard/auth.guard';
import { adminGuard } from './guards/admin-guard/admin.guard';
import { ownerGuard } from './guards/owner-guard/owner.guard';
import { routineGuard } from './guards/routine-guard/routine.guard';
import { creationRoutineGuard } from './guards/routine-guard/creation-routine.guard';
import { isCustomerGuard } from './guards/is-customer-guard/is-customer.guard';
import { RoutineComponent } from './routine/routine/routine.component';
import { RoutineEditComponent } from './routine/routine-edit/routine-edit.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { isFirstLoginGuard } from './guards/is-first-login-guard/is-first-login.guard';
import { ClassesAdministrationComponent } from './classes/classes-administration/classes-administration.component';
import { ScheduledClassesComponent } from './classes/scheduled-classes/scheduled-classes.component';
import { SuscriptionPaymentListComponent } from './suscription-payment/suscription-payment-list/suscription-payment-list/suscription-payment-list.component';
import { teacherGuard } from './guards/teacher.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'clientes', component: CustomerListComponent, canActivate: [authGuard, isCustomerGuard, isFirstLoginGuard] },
  { path: 'profesores', component: TeacherListComponent, canActivate: [authGuard, adminGuard, isFirstLoginGuard] },
  { path: 'administradores', component: AdminListComponent, canActivate: [authGuard, ownerGuard, isFirstLoginGuard] },
  { path: 'usuario/detalle/:userId', component: UserDetailComponent, canActivate: [authGuard, isFirstLoginGuard] },
  { path: 'registro/:userType', component: UserRegisterComponent, canActivate: [authGuard, adminGuard, isFirstLoginGuard] },
  { path: 'cambio-contrasenia', component: ChangePasswordComponent, canActivate: [authGuard] },
  { path: 'ejercicios', component: ExercisesComponent, canActivate: [authGuard, teacherGuard, isFirstLoginGuard] },
  { path: 'rutinas/:userId', component: RoutineListComponent, canActivate: [authGuard, routineGuard, isFirstLoginGuard] },
  { path: 'rutinas/rutina/:routineId', component: RoutineComponent, canActivate: [authGuard, routineGuard, isFirstLoginGuard] },
  { path: 'rutinas/rutina/creacion/:userId', component: RoutineCreationComponent, canActivate: [authGuard, creationRoutineGuard, isFirstLoginGuard] },
  { path: 'rutinas/rutina/:routineId/edicion', component: RoutineEditComponent, canActivate: [authGuard, creationRoutineGuard, isFirstLoginGuard] },
  { path: 'clases/administracion', component: ClassesAdministrationComponent, canActivate: [authGuard, adminGuard, isFirstLoginGuard] },
  { path: 'clases', component: ScheduledClassesComponent, canActivate: [authGuard, isFirstLoginGuard] },
  { path: 'suscripciones', component: SuscriptionPaymentListComponent, canActivate: [authGuard, adminGuard, isFirstLoginGuard] },
  { path: '', component: InitComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
