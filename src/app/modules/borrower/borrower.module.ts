import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BorrowerRoutingModule } from './borrower-routing.module';
import { BorrowerComponent } from './borrower.component';
import { HistoryComponent } from './history/history.component';
import { MyDocumentsComponent } from './my-documents/my-documents.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileComponent } from './profile/profile.component';
import { BorrowerGeneralProfileComponent } from './borrower-general-profile/borrower-general-profile.component';

import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import { FolderDetailComponent } from './folder-detail/folder-detail.component';
import { ShareFolderComponent } from './share-folder/share-folder.component';
// import { ProjectComponent } from './property/project.component';
import { LenderListComponent } from './lender-list/lender-list.component';
import { LenderDetailsComponent } from './lender-details/lender-details.component';
import { UploadPropertyComponent } from './upload-property/upload-property.component';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { MaterialModule } from './../material/material.module';
import { InputComponent } from './../../form/input/input.component';
import { SelectComponent } from './../../form/select/select.component';
import { RadiobuttonComponent } from './../../form/radiobutton/radiobutton.component';
import { CheckboxComponent } from './../../form/checkbox/checkbox.component';
import { DynamicFormComponent } from './../../form/dynamic-form/dynamic-form.component';
import { DynamicFieldDirective, DynamicFieldDirectiveModule } from 'src/app/common/directive/dynamic-field/dynamic-field.directive';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ShareDocumentComponent } from './share-document/share-document.component';
import { PdfViewerModalComponent } from './pdf-viewer-modal/pdf-viewer-modal.component';
import {PdfViewerModule} from "ng2-pdf-viewer";
import { ShareFileModalComponent } from './share-file-modal/share-file-modal.component';
import {MatChipsModule} from '@angular/material/chips';
import { EditSharedFileModalComponent } from './edit-shared-file-modal/edit-shared-file-modal.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { urlSetting } from 'src/app/shared/pipes/url-pipe.pipe';
import { HttpConstants } from 'src/app/common/constants/http.constants';
import { GraphqlModule } from 'src/app/graphql/graphql.module';
@NgModule({
  declarations: [
    BorrowerComponent,
    HistoryComponent,
    MyDocumentsComponent,
    ProfileComponent,
    BorrowerGeneralProfileComponent,
    FolderDetailComponent,
    ShareFolderComponent,
    PropertyDetailsComponent,
    LenderListComponent,
    LenderDetailsComponent,
    UploadPropertyComponent,
    CompleteProfileComponent,
    InputComponent,
    SelectComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    DynamicFormComponent,
    PropertyDetailsComponent,
    PropertyListComponent,
    ShareDocumentComponent,
    PdfViewerModalComponent,
    ShareFileModalComponent,
    EditSharedFileModalComponent,
    urlSetting
  ],
  imports: [
    CommonModule,
    BorrowerRoutingModule,
    SharedModule,
    RouterModule,
    MatIconModule,
    FlexLayoutModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatMenuModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MaterialModule,
    DynamicFieldDirectiveModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PdfViewerModule,
    MatChipsModule,
    MatExpansionModule,
    GraphqlModule
  ],
  providers: [  
    MatDatepickerModule,  
    HttpConstants
  ],
  entryComponents: [
    InputComponent,
    SelectComponent,
    RadiobuttonComponent,
    CheckboxComponent,
  ]
})
export class BorrowerModule { }
