import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      { path: 'chats', loadChildren: () => import('../page/chats/chats.module').then(m => m.ChatsPageModule) },
      { path: 'discover', loadChildren: () => import('../page/discover/discover.module').then(m => m.DiscoverPageModule) },
      { path: 'profile', loadChildren: () => import('../page/update-user-info/update-user-info.module').then(m => m.UpdateUserInfoPageModule) },
      { path: '', redirectTo: 'discover', pathMatch: 'full' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
