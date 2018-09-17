import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ScryfallApiHttpClientService } from '../../services/scryfall-api-http-client/scryfall-api-http-client.service'
import { isComponentView } from '@angular/core/src/view/util';

@Component({
  selector: 'app-gatherer-dialog',
  templateUrl: './gatherer-dialog.component.html',
  styleUrls: ['./gatherer-dialog.component.css']
})
export class GathererDialogComponent implements OnInit {

  public cardNotFound: boolean = false;  
  public cardImageUri: string = null;
  

  constructor(private scryService: ScryfallApiHttpClientService,
              public dialogRef: MatDialogRef<GathererDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
      this.fetchCardImage(data.multiverseId, data.isMobile);
  }

  ngOnInit() {
  }

  public imageAvailable(): boolean {
    return (null != this.cardImageUri)
  }

  public fetchCardImage(multiverseId: number, isMobile: boolean): void {
    this.cardNotFound = false;
    this.scryService
      .GetMultiverseId(multiverseId)
      .subscribe(
        res => {
          var resultingObject = JSON.parse(JSON.stringify(res));
          if (isMobile)
          {
            this.cardImageUri = resultingObject.image_uris.small;
          }
          else {
            this.cardImageUri = resultingObject.image_uris.normal;
          }
        },
        (error: HttpResponse<any>) => {
          this.cardNotFound = true;
          console.error(error);
        });
  }

}
