import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ScryfallApiHttpClientService } from '../../services/scryfall-api-http-client/scryfall-api-http-client.service'

@Component({
  selector: 'app-gatherer-dialog',
  templateUrl: './gatherer-dialog.component.html',
  styleUrls: ['./gatherer-dialog.component.css']
})
export class GathererDialogComponent implements OnInit {

  public cardName: string;
  public setName: string;
  public cardNotFound: boolean = false;
  
  private cardImageUri: string = null;
  

  constructor(private scryService: ScryfallApiHttpClientService,
              public dialogRef: MatDialogRef<GathererDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
      this.cardName = data.cardName;
      this.setName = data.setName;
      this.fetchCardImage();
  }

  ngOnInit() {
  }

  public imageAvailable(): boolean {
    return (null != this.cardImageUri)
  }

  public fetchCardImage(): void {
    this.cardNotFound = false;
    this.scryService
      .GetFuzzyCard(this.cardName)
      .subscribe(
        res => {
          var resultingObject = JSON.parse(JSON.stringify(res));
          this.cardImageUri = resultingObject.image_uris.normal;
        },
        (error: HttpResponse<any>) => {
          this.cardNotFound = true;
          console.error(error);
        });
  }

}
