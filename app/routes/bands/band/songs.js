import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Song from 'rarwe/models/song';
import fetch from 'fetch';

export default class BandsBandSongsRoute extends Route {
  @service catalog;

  async model() {
    let band = this.modelFor('bands.band');
    let url = band.relationships.songs;
    let response = await fetch(url); // Query the url to retrieve the songs
    let json = await response.json(); // Convert to json
    let songs = [];
    for (let item of json.data) {
      let { id, attributes, relationships } = item; // Get data from each item
      let rels = {}; // Set empty object
      for (let relationshipName in relationships) {
        rels[relationshipName] = relationships[relationshipName].links.related; // Set key to whatever relationshipName is, and value to the links.related
      }
      let song = new Song({ id, ...attributes }, rels); //build the song object
      songs.push(song); // Push the song into the songs array
      this.catalog.add('song', song); // Add the song to the catalog
    }
    band.songs = songs; // Add the songs array to the parent band object
    return band;
  }

  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
