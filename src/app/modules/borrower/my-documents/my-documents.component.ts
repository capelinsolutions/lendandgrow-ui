import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { BorrowerService } from 'src/app/services/borrower/borrower.service';
import { PdfViewerModalComponent } from '../pdf-viewer-modal/pdf-viewer-modal.component';
import { ShareFolderComponent } from '../share-folder/share-folder.component';

@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss'],
})
export class MyDocumentsComponent implements OnInit {
  breadcrumbsList: any = [
    {
      title: 'My Documents',
      url: '/borrower/documents',
    },
  ];
  pageEvent: PageEvent;
  pageSize = 4;
  pageSizeOptions: number[] = [10, 20, 30, 40];
  pageSizeForFolders = 10;
  pageSizeOptionsForFolders: number[] = [10, 20, 30, 40];
  foldersList: any = [];
  documentsList: any = [];
  dataSourceDocuments: any = [];
  dataSourceFolders: any = [];
  borrowerId: any
  length: any
  propertyForm: FormGroup = new FormGroup({});
  constructor(private _changeDetector: ChangeDetectorRef,private _borrowerService: BorrowerService,
    private _formBuilder: FormBuilder,private dialog: MatDialog) {}
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('paginatorForFolders', { static: true })
  paginatorForFolders: MatPaginator;
  ngOnInit(): void {
    this.createForm();
    this.getAllPropertiesByPagination();
    setTimeout(() => {}, 1000);
  }

  createForm() {
    this.propertyForm = this._formBuilder.group({
      pageNo: [
        0
      ],
      pageSize: [
        10
      ],
      title: [
        null
      ],
    });
  }
  ngAfterViewInit() {
    this.linkListToPaginator();
    this.linkListToPaginatorForFolders();
    this._changeDetector.detectChanges();
  }
  uploadDocument(e: any) {
    // console.log(e.target.files);
    
  }

  searchBytitle(){
    if(this.pageEvent){
      this.propertyForm.patchValue({
        pageNo: this.pageEvent.pageIndex,
        pageSize: this.pageEvent.pageSize
      })
    }
    let data = this.propertyForm.value;
    if (this.propertyForm.controls.title.value == "")
    {
      this.propertyForm.controls.title.setValue(null);
    }
    this._borrowerService.getPropertiesByPagination(this.propertyForm.value,this.borrowerId).subscribe((res:any)=>{
      this.dataSourceFolders=res?.data?.getPropertyListByPagination?.data.property;
      this.length=res?.data?.getPropertyListByPagination?.data.totalRows;
    })
  }
  
  getAllPropertiesByPagination(){
    this._borrowerService.getPropertiesByPagination(this.propertyForm.value,this.borrowerId).subscribe((res:any)=>{
      // console.log(res);
      this.dataSourceFolders=res?.data?.getPropertyListByPagination?.data.property;
      this.length=res?.data?.getPropertyListByPagination?.data.totalRows;
    })
  }
  linkListToPaginator() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return of(this.documentsList);
        })
      )
      .subscribe((res: any) => {
        const from = this.paginator.pageIndex * this.pageSize;
        const to = from + this.pageSize;
        this.dataSourceDocuments = res.slice(from, to);
      });
  }
  linkListToPaginatorForFolders() {
    merge(this.paginatorForFolders.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return of(this.dataSourceFolders);
        })
      )
      .subscribe((res: any) => {
        const from =
          this.paginatorForFolders.pageIndex * this.pageSizeForFolders;
        const to = from + this.pageSizeForFolders;
        this.dataSourceFolders = res.slice(from, to);
      });
  }
  handlePage(e) {
    this.pageSize = e.pageSize;
  }
  handlePageForFolders(e) {
    this.propertyForm.controls.pageSize.setValue(e.pageSize);
  this.propertyForm.controls.pageNo.setValue(e.pageIndex);
    this.pageSizeForFolders = e.pageSize;
    this.getAllPropertiesByPagination();
  }
  openShareFolderModal() {
    this.dialog.open(PdfViewerModalComponent,{
      minWidth: '400px'
    });
  }
  onClickDocument(e){
      this.openShareFolderModal();
      e.option.selected=false;
  }
}