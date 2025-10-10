// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { NoAuthGuard } from './core/guards/no-auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },


  {
    path: 'welcome',
    loadChildren: () =>
      import('./page/welcome/welcome.module').then(m => m.WelcomePageModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./page/login/login.module').then(m => m.LoginPageModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./page/register/register.module').then(m => m.RegisterPageModule),
    canActivate: [NoAuthGuard],
  },

  
  {
    path: 'register-gender',
    loadChildren: () =>
      import('./page/register-gender/register-gender.module').then(
        m => m.RegisterGenderPageModule
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register-birthdate',
    loadChildren: () =>
      import('./page/register-birthdate/register-birthdate.module').then(
        m => m.RegisterBirthdatePageModule
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register-passions',
    loadChildren: () =>
      import('./page/register-passions/register-passions.module').then(
        m => m.RegisterPassionsPageModule
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register-photos',
    loadChildren: () =>
      import('./page/register-photos/register-photos.module').then(
        m => m.RegisterPhotosPageModule
      ),
    canActivate: [NoAuthGuard],
  },

  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'discover',
    loadChildren: () => import('./page/discover/discover.module').then( m => m.DiscoverPageModule)
  },
  {
    path: 'chats',
    loadChildren: () => import('./page/chats/chats.module').then( m => m.ChatsPageModule)
  },
  {
    path: 'update-user-info',
    loadChildren: () => import('./page/update-user-info/update-user-info.module').then( m => m.UpdateUserInfoPageModule),
    canActivate: [AuthGuard]
  },
  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
