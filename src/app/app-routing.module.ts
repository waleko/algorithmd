import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {NotfoundComponent} from "./pages/notfound/notfound.component";
import {NewCodeComponent} from "./pages/new-code/new-code.component";

export const routes: Routes = [
  {path: "", component: NewCodeComponent},
  {path: "**", component: NotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
