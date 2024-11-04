import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AgmMap } from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild(AgmMap) agmMap: AgmMap; // Reference to the AgmMap instance
  lat: number = 44.678418;
  lng: number = -75.809007;
  zoom: number = 8;
  drawingManager: google.maps.drawing.DrawingManager;
  drawnRectangles: google.maps.Rectangle[] = []; // Array to store drawn rectangles

  ngOnInit() {
    // Initialization logic can go here if needed
  }

  ngAfterViewInit() {
    this.initDrawingManager();
    this.getGoogleMap();
  }

  getGoogleMap() {
    try {
      console.log('agmMap:', this.agmMap); // Log the agmMap reference
      this.agmMap.mapReady.subscribe((googleMap: google.maps.Map) => {
        console.log('Google Maps instance:', googleMap);
        this.drawingManager.setMap(googleMap); // This line will be updated

        // Adding the overlaycomplete listener
        google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
          if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
            const bounds = event.overlay.getBounds();
            console.log('Rectangle drawn:', bounds.toString());
            this.populateBounds(bounds);
            this.drawnRectangles.push(event.overlay); // Store the drawn rectangle

            // Add listener for bounds_changed event
            google.maps.event.addListener(event.overlay, 'bounds_changed', () => {
              const newBounds = event.overlay.getBounds();
              console.log('Rectangle modified:', newBounds.toString());
              this.populateBounds(newBounds);
            });
          }
        });
      });
    } catch (error) {
      console.error('Error getting Google Maps instance:', error);
    }
  }

  populateBounds(bounds) {
    // Populate the first element of the first tuple to the "South" input field
    document.getElementById('south').setAttribute('value', bounds.getSouthWest().lat().toString());
    // Populate the second element of the first tuple to the "West" input field
    document.getElementById('west').setAttribute('value', bounds.getSouthWest().lng().toString());
    // Populate the first element of the second tuple to the "North" input field
    document.getElementById('north').setAttribute('value', bounds.getNorthEast().lat().toString());
    // Populate the second element of the second tuple to the "East" input field
    document.getElementById('east').setAttribute('value', bounds.getNorthEast().lng().toString());
  }

  initDrawingManager() {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      //drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.RECTANGLE]
      },
      rectangleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 0.2,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });
  }

  eraseRectangles() {
    this.drawnRectangles.forEach(rectangle => {
      rectangle.setMap(null); // Remove rectangle from the map
    });
    this.drawnRectangles = []; // Clear the array
    document.getElementById('south').setAttribute('value', '');
    document.getElementById('west').setAttribute('value', '');
    document.getElementById('north').setAttribute('value', '');
    document.getElementById('east').setAttribute('value', '');
  }
}
