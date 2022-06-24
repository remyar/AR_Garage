import createAction from '../../middleware/actions';
var html2json = require('html2json').html2json;

export async function getAutoFromPlate(plate = "BB-456-CC", { extra, getState }) {

    const api = extra.api;
    try {

        let state = getState();
        let vehicules = state.vehicules;

        let vehicule = vehicules.find((el) => el.plate == plate);

        if (!vehicule) {
            vehicule = {};
            await api.get("https://opisto.fr");
            await api.post("https://www.opisto.fr/fr/Home/SearchImmatriculation?rapidAutoCatSearchImmat=&ImmatOpisto=" + plate + "&X-Requested-With=XMLHttpRequest");
            let found = await api.post("https://www.opisto.fr/search/immatriculation/vehicleFound");
            //let found = 'True';
            if (found === "True") {
                let vehiculeHtml = await api.post("https://www.opisto.fr/partial/auto/identifiedvehicle");
                let filtersHtml = await api.post("https://www.opisto.fr/partial/common/filtersapplied");
                //let vehiculeHtml = '<div class="box-immat d-flex flex-column flex-md-row gap-2 gap-lg-3 fs-6 align-items-center"><div class="col-sm-12"><div class="gotham-rounded-medium">V&#233;hicule identifi&#233; : RENAULT LAGUNA 3 PHASE 2 1.5 DCI - 8V TURBO</div><div class="d-flex flex-column flex-md-row gap-2 gap-lg-3"><span> Energie :Diesel                </span><span>Code moteur :K9K_782                </span><span>Puissance :110                        CV</span><span>1&#232;re mise en circulation : 01/11/2010                </span></div></div><div class="col-sm-3"></div></div>';
                //let filtersHtml = '<div class="d-flex flex-wrap my-3 align-items-center"><span>Filtres appliqu&#233;s : </span><span class="badge rounded-pill filter-badge">Marque : RENAULT &nbsp;<a href="#" onclick="resetPanel(\'brand\');" class="text-white">&times;</a></span><span class="badge rounded-pill filter-badge">Mod&#232;le : LAGUNA 3 PHASE 2&nbsp;<a href="#" onclick="resetPanel(\'model\');" title="Etendre la recherche à la gamme" class="text-white"><i class="flaticon-search i-xxs"></i></a>&nbsp;<a href="#" onclick="resetPanel(\'model_range\');" class="text-white">&times;</a></span><span class="badge rounded-pill filter-badge">Carburant : Diesel &nbsp;<a href="#" onclick="resetPanel(\'energy\');" class="text-white">&times;</a></span><span class="badge rounded-pill filter-badge">Puissance : 110 cv &nbsp;<a href="#" onclick="resetPanel(\'power\');" class="text-white">&times;</a></span><span class="badge rounded-pill filter-badge">Code moteur : K9K_782 &nbsp;<a href="#" onclick="resetPanel(\'engine_code\');" class="text-white">&times;</a></span></div>';

                let json = html2json(filtersHtml);

                function _findChild(_str  , _child){
                    return _child.map((__child) => {
                        if ( __child.node == "text" ){
                            var txt = document.createElement("textarea");
                            txt.innerHTML = __child.text;
                            if( txt.value.toUpperCase().includes(_str.toUpperCase()) ){
                                return   txt.value;
                            }
                        }
                        if ( __child.child ){
                            return _findChild(_str , __child.child).flat().filter((el) => el != undefined);
                        }
                    }).flat().filter((el) => el != undefined);
                }

                function _cleanHtml(str){
                    return str.replace(/&.*;/g,'').replace(/\n/g, '').trim().replace(/\s{2,}/g, ' ');
                }

                let htmlMarque = _findChild("Marque",json.child).length > 0 ? _cleanHtml(_findChild("Marque",json.child)[0]) : "";
                let htmlModele = _findChild("Modèle",json.child).length > 0 ? _cleanHtml(_findChild("Modèle",json.child)[0]) : "";
                let htmlCarburant = _findChild("Carburant",json.child).length > 0 ? _cleanHtml(_findChild("Carburant",json.child)[0]) : "";
                let htmlPuissance = _findChild("Puissance",json.child).length > 0 ? _cleanHtml(_findChild("Puissance",json.child)[0]) : "";
                let htmlCodeMoteur = _findChild("Code moteur",json.child).length > 0 ? _cleanHtml(_findChild("Code moteur",json.child)[0]) : "";

                vehicule.brand = htmlMarque.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');
                vehicule.model = htmlModele.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');
                vehicule.energie = htmlCarburant.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');
                vehicule.puissance = htmlPuissance.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');
                vehicule.engine_code = htmlCodeMoteur.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');

                json = html2json(vehiculeHtml);

                let htmlCommercialname = _findChild("Véhicule identifié",json.child).length > 0 ? _cleanHtml(_findChild("Véhicule identifié",json.child)[0]) : "";
                let htmlFirst_batch  = _findChild("1ère mise en circulation",json.child).length > 0 ? _cleanHtml(_findChild("1ère mise en circulation",json.child)[0]) : "";

                vehicule.commercial_name = htmlCommercialname.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');
                vehicule.first_batch = htmlFirst_batch.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');

                vehicule.id = vehicules.length;
                vehicule.plate = plate;
                
                vehicules.push(vehicule);
                
            } else {
                throw new Error("Véhicule non trouvé");
            }

        } else {
            vehicule.deleted = 0;
        }

        return {
            vehicules: vehicules,
            vehicule: { ...vehicule }
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAutoFromPlate);