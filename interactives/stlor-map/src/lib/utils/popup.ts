import maplibregl, { type MapGeoJSONFeature } from 'maplibre-gl';

import { opacifyHex } from '$lib/utils/color';
import { POPUP_LAYER_IDS } from '$lib/utils/config';
import { LAND_USE_TO_COLORS, RIGHTS_TYPE_TO_COLORS } from '$lib/utils/constants';
import { capitalize } from '$lib/utils/format';
import type { LandUse, ParcelProperties } from '$lib/types';

export class PaginatedPopup {
	private map: maplibregl.Map;
	private popup: maplibregl.Popup | null = null;
	private features: MapGeoJSONFeature[] = [];
	private currentIndex: number = 0;

	constructor(map: maplibregl.Map) {
		this.map = map;
		this.setupClickListener();
	}

	private setupClickListener() {
		this.map.on('click', (e) => {
			const layerIds =
				this.map
					.getStyle()
					.layers?.filter((layer) => POPUP_LAYER_IDS.includes(layer.id))
					.map((layer) => layer.id) || [];

			const features = this.map.queryRenderedFeatures(e.point, { layers: layerIds });

			if (features.length > 0) {
				this.features = features;
				this.currentIndex = 0;
				this.showPopup(e.lngLat);
			} else if (this.popup) {
				this.popup.remove();
				this.popup = null;
			}
		});
	}

	private showPopup(lngLat: maplibregl.LngLat) {
		if (this.popup) {
			this.popup.remove();
		}

		const feature = this.features[this.currentIndex];
		const popupContent = this.createPopupContent(feature);

		this.popup = new maplibregl.Popup({ closeButton: false })
			.setLngLat(lngLat)
			.setHTML(popupContent)
			.addTo(this.map);

		this.map.easeTo({ center: lngLat });

		this.setupPaginationListeners();
	}

	private createPopupContent(feature: MapGeoJSONFeature): string {
		const { object_id, reservation_name, rights_type, land_use, clipped_acres } =
			feature.properties;
		const landUses = land_use.replaceAll(/[[\]"]/g, '').split(',');

		let content = `
    <div class="stack stack-xs">
      <h2 class="text-sm font-sans-alt font-semibold border-b border-b-earth border-opacity-25">Parcel ${object_id}</h2>
      <div class="grid grid-cols-2 gap-2">
        <p class="text-xs font-semibold">Reservation</p>
        <p class="text-xs">${reservation_name}</p>
        <p class="text-xs font-semibold">Acres</p>
        <p class="text-xs">${clipped_acres}</p>
        <p class="text-xs font-semibold">Rights Type</p>
        <div class="stack-h stack-h-xs items-center">
            <div
              class="h-3 w-3 border"
              style="background-color: ${opacifyHex(RIGHTS_TYPE_TO_COLORS[rights_type as ParcelProperties['rights_type']], 0.75)}; border-color: ${RIGHTS_TYPE_TO_COLORS[rights_type as ParcelProperties['rights_type']]};"
            >
            </div>
          <span class="text-xs">${capitalize(rights_type)}</p>
        </div>
        <p class="text-xs  font-semibold">Land Use</p>
        <div class="stack stack-2xs">
          ${landUses
						.map(
							(landUse: LandUse) => `
              <div class="stack-h stack-h-xs items-center">
                <div
                  class="h-3 w-3 border"
                  style="background-color: ${opacifyHex(LAND_USE_TO_COLORS[landUse], 0.75)}; border-color: ${LAND_USE_TO_COLORS[landUse]};"
                >
                </div>
                <span class="text-xs">${landUse}</span>
              </div>`
						)
						.join('')}
        </div>
      </div>
    `;

		if (this.features.length > 1) {
			content += `
      <div class="flex">
        <button id="prev-feature" ${this.currentIndex === 0 ? 'disabled' : ''} class="disabled:opacity-50 disabled:cursor-not-allowed">
          <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z" fill="currentColor"></path></svg>
        </button>
        <span>${this.currentIndex + 1} of ${this.features.length}</span>
        <button id="next-feature" ${this.currentIndex === this.features.length - 1 ? 'disabled' : ''} class="disabled:opacity-50 disabled:cursor-not-allowed">
           <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z" fill="currentColor"></path></svg>
        </button>
      </div>
      `;
		}

		content += '</div>';

		return content;
	}

	private setupPaginationListeners() {
		const prevButton = document.getElementById('prev-feature');
		const nextButton = document.getElementById('next-feature');

		prevButton?.addEventListener('click', () => this.navigateFeatures(-1));
		nextButton?.addEventListener('click', () => this.navigateFeatures(1));
	}

	private navigateFeatures(direction: number) {
		this.currentIndex += direction;
		this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.features.length - 1));
		this.showPopup(this.popup!.getLngLat());
	}
}
