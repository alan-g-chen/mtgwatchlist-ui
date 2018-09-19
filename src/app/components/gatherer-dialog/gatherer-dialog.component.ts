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

  public cardNotFound: boolean = false;
  public cardImageUri: string = null;
  public multiverseId: number;
  
  constructor(private scryService: ScryfallApiHttpClientService,
    public dialogRef: MatDialogRef<GathererDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.multiverseId = data.multiverseId;
    this.fetchCardImage();
    this.dialogRef.updatePosition({ top: '0px', left: '0px' });
  }

  ngOnInit() {
  }

  public imageAvailable(): boolean {
    return (null != this.cardImageUri)
  }

  public fetchCardImage(): void {
    this.cardNotFound = false;
    this.cardImageUri = "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + this.multiverseId + "&type=card";
  }

  public fetchLargerCardImage(): void {
    this.cardNotFound = false;
    this.scryService
      .GetMultiverseId(this.multiverseId)
      .subscribe(
        res => {
          var resultingObject = JSON.parse(JSON.stringify(res));
          this.cardImageUri = resultingObject.image_uris.normal;
        },
        (error: HttpResponse<any>) => {
          console.error(error);
        });
  }
}
