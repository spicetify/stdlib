/* Copyright © 2024
 *      Delusoire <deluso7re@outlook.com>
 *
 * This file is part of bespoke/modules/stdlib.
 *
 * bespoke/modules/stdlib is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * bespoke/modules/stdlib is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with bespoke/modules/stdlib. If not, see <https://www.gnu.org/licenses/>.
 */

type ParsableAsURI = any;

type IsThisURIType<A extends keyof URITypes> = (url: ParsableAsURI) => url is URIClass<A>;

export type URIClass<A extends keyof URITypes> = any;

export type URITypes = {
   AD: "ad";
   ALBUM: "album";
   GENRE: "genre";
   QUEUE: "queue";
   APPLICATION: "application";
   ARTIST: "artist";
   ARTIST_TOPLIST: "artist-toplist";
   ARTIST_CONCERTS: "artist-concerts";
   AUDIO_FILE: "audiofile";
   COLLECTION: "collection";
   COLLECTION_ALBUM: "collection-album";
   COLLECTION_ARTIST: "collection-artist";
   COLLECTION_MISSING_ALBUM: "collection-missing-album";
   COLLECTION_TRACK_LIST: "collectiontracklist";
   CONCEPT: "concept";
   CONCERT: "concert";
   CONTEXT_GROUP: "context-group";
   CULTURAL_MOMENT: "cultural-moment";
   DAILY_MIX: "dailymix";
   EMPTY: "empty";
   EPISODE: "episode";
   FACEBOOK: "facebook";
   FOLDER: "folder";
   FOLLOWERS: "followers";
   FOLLOWING: "following";
   IMAGE: "image";
   INBOX: "inbox";
   INTERRUPTION: "interruption";
   LIBRARY: "library";
   LIVE: "live";
   ROOM: "room";
   EXPRESSION: "expression";
   LOCAL: "local";
   LOCAL_TRACK: "local";
   LOCAL_ALBUM: "local-album";
   LOCAL_ARTIST: "local-artist";
   MERCH: "merch";
   MERCHHUB: "merchhub";
   MOSAIC: "mosaic";
   PLAYLIST: "playlist";
   PLAYLIST_V2: "playlist-v2";
   PRERELEASE: "prerelease";
   PROFILE: "profile";
   PUBLISHED_ROOTLIST: "published-rootlist";
   RADIO: "radio";
   ROOTLIST: "rootlist";
   SEARCH: "search";
   SHOW: "show";
   SOCIAL_SESSION: "socialsession";
   SPECIAL: "special";
   STARRED: "starred";
   STATION: "station";
   TEMP_PLAYLIST: "temp-playlist";
   TOPLIST: "toplist";
   TRACK: "track";
   TRACKSET: "trackset";
   USER_TOPLIST: "user-toplist";
   USER_TOP_TRACKS: "user-top-tracks";
   UNKNOWN: "unknown";
   VIDEO: "video";
   MEDIA: "media";
   QUESTION: "question";
   POLL: "poll";
   RESPONSE: "response";
   COURSE: "course";
   LESSON: "lesson";
   CANVAS: "canvas";
};

const exposeURI = ({ require, chunks }: Webpack) => {
   const [URIModuleID] = chunks.find(
      ([id, v]) => v.toString().includes("Invalid Spotify URI!") && Object.keys(require(id)).length > 10,
   );
   const URIModule = require(URIModuleID);
   const [Types, ...vs] = Object.values(URIModule) as [URITypes, ...Function[]];
   const TypesKeys = Object.keys(Types);

   const isTestFn = fn => TypesKeys.some(t => fn.toString().includes(`${t}}`));
   const isCreateFn = fn => TypesKeys.some(t => fn.toString().includes(`${t},`));

   const CaseLikeThis = s => s.split("_").map(capitalize).join("");

   const fnsByType = Object.groupBy(vs, fn => (isTestFn(fn) ? "test" : isCreateFn(fn) ? "create" : undefined));
   const is = Object.fromEntries(
      fnsByType.test.map(fn => [CaseLikeThis(fn.toString().match(/([\w_\d]{2,})\}/)[1]), fn]),
   ) as {
      Ad: IsThisURIType<any>;
      Album: IsThisURIType<any>;
      Application: IsThisURIType<any>;
      Artist: IsThisURIType<any>;
      CollectionAlbum: IsThisURIType<any>;
      CollectionArtist: IsThisURIType<any>;
      Collection: IsThisURIType<any>;
      Concert: IsThisURIType<any>;
      Episode: IsThisURIType<any>;
      Folder: IsThisURIType<any>;
      LocalTrack: IsThisURIType<any>;
      Playlist: IsThisURIType<any>;
      PlaylistV2: IsThisURIType<any>;
      Profile: IsThisURIType<any>;
      Radio: IsThisURIType<any>;
      Show: IsThisURIType<any>;
      SocialSession: IsThisURIType<any>;
      Station: IsThisURIType<any>;
      Track: IsThisURIType<any>;
   };
   const create = Object.fromEntries(
      fnsByType.create.map(fn => [CaseLikeThis(fn.toString().match(/([\w_\d]{2,})\,/)[1]), fn]),
   ) as {
      Album: any;
      Application: any;
      Artist: any;
      CollectionAlbum: any;
      CollectionArtist: any;
      Collection: any;
      Concert: any;
      Episode: any;
      Folder: any;
      LocalAlbum: any;
      LocalArtist: any;
      PlaylistV2: any;
      Prerelease: any;
      Profile: any;
      Queue: any;
      Search: any;
      Show: any;
      SocialSession: any;
      Station: any;
      Track: any;
      UserToplist: any;
   };
   const uniqueFns = fnsByType[undefined as keyof typeof fnsByType];

   const findAndExcludeBy = (...strings) => {
      const i = uniqueFns.findIndex(f => strings.every(str => f.toString().includes(str)));
      return uniqueFns.splice(i, 1)[0];
   };

   const isSameIdentity = findAndExcludeBy("PLAYLIST") as (a: ParsableAsURI, b: ParsableAsURI) => boolean;
   const urlEncode = findAndExcludeBy(".URI") as (str: string) => string;
   const idToHex = findAndExcludeBy("22===") as (str: string) => string;
   const hexToId = findAndExcludeBy("32===") as (str: string) => string;
   const from = findAndExcludeBy("allowedTypes") as (uri: ParsableAsURI) => URIClass<any>;
   const fromString = findAndExcludeBy("Argument `uri` must be a string.") as (str: string) => URIClass<any>;

   const is_PlaylistV1orV2 = findAndExcludeBy(
      `${is.Playlist.name}(e)||${is.PlaylistV2.name}(e)`,
   ) as IsThisURIType<any>;

   return {
      Types,
      isSameIdentity,
      urlEncode,
      idToHex,
      hexToId,
      from,
      fromString,
      is: Object.assign(is, {
         PlaylistV1OrV2: is_PlaylistV1orV2,
      }),
      create,
   };
};
