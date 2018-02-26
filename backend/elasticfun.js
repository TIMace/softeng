'use strict'

exports.elasticfun = {

    initElasticSearchIndices : (client) => {

        client.indices.exists({ index : 'event'}, (err1, resp1, status1) => {
            if (!resp1)
                client.indices.create( { index: 'event' }, (err2, resp2, status2) => {
                    if(err2)
                        console.log('ERROR' + err2)
                    else
                        console.log("Index event created : ", resp2)
                })
        })
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
                event_datetime : obj.evnt.event_date,
                event_available_tickets : obj.evnt.event_available_tickets,
                event_lattitude : obj.evnt.event_lattitude,
                event_longtitude : obj.evnt.event_longtitude,
                event_minimum_age : obj.evnt.event_minimum_age,
                event_maximum_age : obj.evnt.event_maximum_age,
                event_map_data : obj.evnt.event_map_data,
                categories : obj.categories,
                provider_email : obj.provider.provider_email,
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
        // const row = { }
        // Object.keys(obj.body).forEach((key) => { row[key] = obj[key] })
        client.update( {
            index : 'event',
            id : obj.event_id,
            type : 'event',
            body : {
                doc : obj.body,
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
    searchEvent : (client, res, obj) => {
        client.search( {
            index : 'event',
            type : 'event',
            body : {
                query : {
                    query_string : {
                        query : (() => {
                            let tel = []
                            obj.term.split(' ').forEach(x => tel.push('*' + x + '*'))
                            return tel.join(' OR ')
                        })()
                    },
                }
            }
        }, (err, resp, status) => {
            if (err) {
                console.log("search error: " + err)
                res.json(err)
            } else {
                res.json(resp.hits.hits)
                console.log("--- Response ---")
                console.log(resp)
                console.log("--- Hits ---")
                resp.hits.hits.forEach((hit) => {
                    console.log(hit)
                } )
            }
        } )
    },


    deleteEvent : (client, obj) => {
        client.delete({
            index : 'event',
            id : obj.event_id,
            type : 'event'
        }, (err, resp, status) => {
            if (err)
                console.log('Error on deleteEvent on ElasticSearch : ' + err)
            else
                console.log('Reponse for deleteEvent on ElasticSearch : ' + resp)
        })
    }

}