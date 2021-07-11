import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {NotfoundComponent} from "./pages/notfound/notfound.component";
import {NewCodeComponent} from "./pages/new-code/new-code.component";
import {ListCodesComponent} from "./pages/list-codes/list-codes.component";
import {AuthGuard} from "@auth0/auth0-angular";
import {ViewCodeComponent} from "./pages/view-code/view-code.component";

export const routes: Routes = [
  {path: "", component: NewCodeComponent},
  {path: "my", component: ListCodesComponent, canActivate: [AuthGuard]},
  {path: "view/:uid", component: ViewCodeComponent},
  {path: "**", component: NotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
