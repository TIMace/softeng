'use strict'

exports.elasticfun = {

    initElasticSearchIndices : (client) => {

        client.indices.exists({ index : 'event'}, (err, resp, status) => {
            if (!resp)
                client.indices.create( { index: 'event' }, (err, resp, status) => {
                    if(err)
                        console.log('ERROR' + err)
                    else
                        console.log("Index event created : ", resp)
                })
        })

        // client.indices.exists({ index : 'provider'}, (err, resp, status) => {
        //     if (!resp)
        //         client.indices.create( { index: 'provider' }, (err, resp, status) => {
        //             if(err)
        //                 console.log('ERROR' + err)
        //             else
        //                 console.log("Index provider created : ", resp)
        //         })
        // })
    },


    addEvent : (client, obj) => {
        client.index( {
            index : 'event',
            id : obj.evnt.event_id,
            type : 'event',
            body : {
                event_price : obj.evnt.event_price,
                event_name : obj.evnt.event_name,
                event_description : obj.evnt.event_description,
                event_date : obj.evnt.event_date,
                event_available_tickets : obj.evnt.event_available_tickets,
                event_lattitude : obj.evnt.event_lattitude,
                event_longtitude : obj.evnt.event_longtitude,
                event_minimum_age : obj.evnt.event_minimum_age,
                event_maximum_age : obj.evnt.event_maximum_age,
                event_map_data : obj.evnt.event_map_data,
                categories : obj.categories,
                provider_email : obj.provider.provider_email,
                provider_join_date : obj.provider.provider_join_date,
                provider_first_name : obj.provider.provider_first_name,
                provider_last_name : obj.provider.provider_last_name,
                provider_comp_name : obj.provider.provider_comp_name,
                provider_address : obj.provider.provider_address,
                provider_phone_num : obj.provider.provider_phone_num
            }
        }, (err, resp, status) => {
            if (err)
                console.log('Error on addEvent on ElasticSearch : ' + err)
            else
                console.log('Reponse for addEvent on ElasticSearch : ' + resp)
        } )
    },


    // obj = { event_id : X , body : { DATA TO BE UPDATED } }
    updateEvent : (client, obj) => {
        const row = { }
        Object.keys(obj.data).forEach((key) => { row[key] = obj[key] })
        client.update( {
            index : 'event',
            id : obj.event_id,
            type : 'event',
            body : {
                doc : row,
                doc_as_upsert : true
            }
        }, (err, resp) => {
            if (err)
                console.log('Error on addEvent on ElasticSearch : ' + err)
            else
                console.log('Reponse for addEvent on ElasticSearch : ' + resp)
        } )
    },


    // obj = { term : 'xxxx' }
    searchEvent : (client, obj) => {
        client.search( {
            index : 'event',
            type : 'event',
            body : {
                query : {
                    query_string : { query : obj.term.split(' ').join(' OR ') },
                    auto_generate_synonyms_phrase_query : true
                }
            }
        }, (err, resp, status) => {
            if (err) {
                console.log("search error: " + err)
            } else {
                console.log("--- Response ---")
                console.log(resp)
                console.log("--- Hits ---")
                resp.hits.hits.forEach((hit) => {
                    console.log(hit)
                } )
            }
        } )
    }

}