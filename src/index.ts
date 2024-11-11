import { HeaderBuilder, StationBuilder, UrlBuilder } from './utils/apiCall';

async function main() {
   const station = new StationBuilder();

   try {
       let headers = HeaderBuilder.default();
       let response = await station.setQuery('Leipzig Hbf')
           .setLimit(1)
           .setFuzzy(true)
           .setCompletion(true)
           .build();

       console.log(response);
   } catch (e: any) {
         console.error(e);
   }
}

main().then(r => console.log('done')).catch(e => console.error(e));