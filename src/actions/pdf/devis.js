import jsPDF from 'jspdf';
import createAction from '../../middleware/actions';
import robotoFont from './roboto_regular';
import robotoBoldFont from './roboto_bold';
import 'jspdf-autotable';

export async function devis(devis, printAndSave, { extra, getState }) {
    const settings = getState().settings;
    let entrepriseSettings = settings.entreprise;
    let paiementSettings = settings.paiement;

    let numPage = 1;
    let totalPage = 1;
    let rows = [];
    let totalMontant = 0;

    try {
        rows = devis.products.map((el, idx) => {
            totalMontant += (parseFloat(el.taux) * parseFloat(el.quantity));
            return { ...el, quantite: el.quantity, num_line: idx + 1, brand_name: ((el.marque ? (el.marque + ' -') : '') + ' ' + (el.nom ? el.nom : el.commentaire ? el.commentaire : ' ')).trim(), prix_vente: parseFloat(el.taux).toFixed(2) + " €", prix_total: (parseFloat(el.taux) * parseFloat(el.quantity)).toFixed(2) + ' €' };
        });

        totalPage =  Math.ceil(Math.max(1, (rows.length / 9)));
       
    } catch (err) {
        throw { message: err.message };
    }

    try {

        let lineOffset = 30;

        const pdf = new jsPDF('p', 'pt');


        pdf.addFileToVFS(robotoFont.name, robotoFont.font);
        pdf.addFileToVFS(robotoBoldFont.name, robotoBoldFont.font);
        pdf.addFont(robotoFont.name, "roboto", "normal");
        pdf.addFont(robotoBoldFont.name, "roboto", "bold");
        pdf.setFont("roboto");

        function _pushText(str, offsetX = 30, offsetY = 30) {
            str = str?.toString() || "";
            pdf.text(str, offsetX, lineOffset + offsetY);
        }

        function _addLine() {
            lineOffset += pdf.getLineHeight();
        }


        for (let i = 0; i < totalPage; i++) {

            if (i != 0) {
                numPage++;
                pdf.addPage();
            }
            lineOffset = 30;

            settings.logo && pdf.addImage(/*'data:image/png;base64,' + */settings.logo, 'PNG', 30, lineOffset / 2 + 5, 305 / 2, 140 / 2);

            pdf.setFontSize(16);
            pdf.setTextColor("#97a3b5");
            pdf.setFont("roboto", "bold");
            _pushText("Devis n° " + devis.id, pdf.internal.pageSize.getWidth() - 200);

            _addLine();
            _addLine();
            _addLine();

            pdf.setFontSize(12);
            pdf.setTextColor("#97a3b5");
            pdf.setFont("roboto", "normal");

            _pushText("Devis proposé par");
            _pushText("Devis proposé a", (pdf.internal.pageSize.getWidth() / 2));

            _addLine();

            pdf.setLineWidth(0.1);
            pdf.line(30, lineOffset + (pdf.getLineHeight() * 2), (pdf.internal.pageSize.getWidth() / 2) - 30, lineOffset + (pdf.getLineHeight() * 2)); // vertical line
            pdf.line((pdf.internal.pageSize.getWidth() / 2), lineOffset + (pdf.getLineHeight() * 2), pdf.internal.pageSize.getWidth() - 30, lineOffset + (pdf.getLineHeight() * 2)); // vertical line

            _addLine();
            pdf.setTextColor("#000000");
            pdf.setFont("roboto", "bold");
            _pushText(entrepriseSettings?.nom || "");
            //_pushText((devis?.client?.nom?.toUpperCase() || "") + " " + (devis?.client?.prenom || ""), (pdf.internal.pageSize.getWidth() / 2));
            _addLine();
            pdf.setFont("roboto", "normal");

            _pushText(entrepriseSettings?.adresse1 || "");
            _addLine();

            _pushText(entrepriseSettings?.adresse2 || "");
            _addLine();

            _pushText((entrepriseSettings?.code_postal || "") + " " + (entrepriseSettings?.ville || ""));
            _addLine();
            _pushText("Télèphone : " + (entrepriseSettings?.telephone || ""));
            _addLine();
            if (entrepriseSettings?.email && entrepriseSettings?.email != '') {
                _pushText("mail : " + entrepriseSettings?.email);
                _addLine();
            }
            _pushText("Siret : " + (entrepriseSettings?.siret || ""));
            _addLine();
            _pushText("Enregistrer au RCS de : " + (entrepriseSettings?.rcs || ""));

            lineOffset -= pdf.getLineHeight() * 6;

            _pushText((devis?.client?.nom?.toUpperCase() || "") + " " + (devis?.client?.prenom || ""), (pdf.internal.pageSize.getWidth() / 2));
            _addLine();

            _pushText((devis?.client?.adresse1 || ""), (pdf.internal.pageSize.getWidth() / 2));

            _addLine();
            _pushText(devis?.client?.adresse2 || "", (pdf.internal.pageSize.getWidth() / 2));

            _addLine();
            _pushText((devis?.client?.code_postal || "") + " " + (devis?.client?.ville || ""), (pdf.internal.pageSize.getWidth() / 2));
            _addLine();
            _pushText(devis?.client?.telephone && "Télèphone : " + (devis?.client?.telephone || ""), (pdf.internal.pageSize.getWidth() / 2));
            _addLine();
            _pushText(devis?.client?.email && ("mail : " + (devis?.client?.email || "")), (pdf.internal.pageSize.getWidth() / 2));


            lineOffset += pdf.getLineHeight() * 6;
            _addLine();

            pdf.setFillColor(240, 240, 240);
            pdf.roundedRect(30, lineOffset, pdf.internal.pageSize.getWidth() - 30 - 30, (pdf.getLineHeight() * 3), 4, 4, 'F');

            pdf.setFontSize(10);

            lineOffset -= pdf.getLineHeight();
            lineOffset -= 1;
            pdf.setTextColor(128, 128, 128);
            _pushText("Date du devis", 30 + 10);
            // _pushText("Date de livraison", (pdf.internal.pageSize.getWidth() / 4));
            _pushText("Condition de paiement", (pdf.internal.pageSize.getWidth() / 3));
            _pushText("Validité de l'offre", (pdf.internal.pageSize.getWidth() / 3) * 2);
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            _addLine();
            _pushText(devis.date ? new Date(devis.date).toLocaleDateString() : new Date().toLocaleDateString(), 30 + 10);
            // _pushText(devis.expiration || "", (pdf.internal.pageSize.getWidth() / 4));
            _pushText("30 jours", (pdf.internal.pageSize.getWidth() / 3));
            _pushText(devis.expiration ? new Date(devis.expiration).toLocaleDateString() : new Date().toLocaleDateString(), (pdf.internal.pageSize.getWidth() / 3) * 2);

            //-- information du véhicule
            lineOffset += pdf.getLineHeight() * 3;
            lineOffset += 5;
            pdf.setFillColor(240, 240, 240);
            pdf.roundedRect(30, lineOffset, pdf.internal.pageSize.getWidth() - 30 - 30, (pdf.getLineHeight() * 3), 4, 4, 'F');

            pdf.setFontSize(10);
            lineOffset -= pdf.getLineHeight();
            lineOffset -= 1;
            pdf.setTextColor(128, 128, 128);
            _pushText("Véhicule", 30 + 10);
            _addLine();
            lineOffset += 2;
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);

            _pushText(devis.vehicule?.plate || "", 30 + 10);
            _pushText(devis.vehicule?.designation || "", (pdf.internal.pageSize.getWidth() / 5));
            _pushText(devis.vehicule?.kilometrage ? (devis.vehicule?.kilometrage + " km") : "", (pdf.internal.pageSize.getWidth() - 150));

            lineOffset += pdf.getLineHeight() * 4;

            let _rows = [];
            let restant = rows.length;
            for (let j = 0; j < (Math.min(9, restant)); j++) {
                _rows.push(rows.shift());
            }

            function _getColumns() {
                return [
                    { title: '#', dataKey: "num_line" },
                    { title: 'Ref', dataKey: "ref_fab" },
                    { title: 'Désignation', dataKey: "brand_name" },
                    { title: 'Quantité', dataKey: "quantite" },
                    { title: 'Prix Unit.', dataKey: "prix_vente" },
                    { title: 'Prix Total', dataKey: "prix_total" },
                ];
            };

            pdf.autoTable(_getColumns(), _rows, {
                theme: "plain",
                styles: {
                    font: "roboto",
                },
                showHeader: 'firstPage',
                margin: { top: 10, left: 30, right: 30 },
                startY: lineOffset,
            });
            lineOffset += (22 * (_rows.length) + 15);

            pdf.setFontSize(12);
            pdf.setFont("roboto", "bold");

            if (i == (totalPage - 1)) {
                pdf.line((pdf.internal.pageSize.getWidth() / 2), lineOffset + 12, pdf.internal.pageSize.getWidth() - 30, lineOffset + 12); // vertical line
                _pushText("Montant Total : ", (pdf.internal.pageSize.getWidth() / 4) * 2);
                _pushText(totalMontant.toFixed(2) + ' €', ((pdf.internal.pageSize.getWidth() / 4) * 3) + 30);
            }

            lineOffset = pdf.internal.pageSize.getHeight() - (13 * pdf.getLineHeight());

            pdf.setFillColor(240, 240, 240);
            pdf.roundedRect(30, lineOffset, pdf.internal.pageSize.getWidth() - 30 - 30, (pdf.getLineHeight() * 10), 4, 4, 'F');

            pdf.setFontSize(10);
            lineOffset -= pdf.getLineHeight();
            pdf.setTextColor(128, 128, 128);
            _pushText("Paiement souhaité par virement bancaire", 30 + 10);
            _pushText("Chéque a l'ordre de", (pdf.internal.pageSize.getWidth() / 2));
            _addLine();
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            _pushText(paiementSettings?.order || "", (pdf.internal.pageSize.getWidth() / 2));
            _addLine();
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.setFont("roboto", "bold");
            _pushText("Nom associé au compte bancaire", 30 + 10);
            _addLine();
            pdf.setFont("roboto", "normal");
            _pushText(paiementSettings?.nom || "", 30 + 10);
            _addLine();
            _addLine();
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.setFont("roboto", "bold");
            _pushText("IBAN", 30 + 10);
            _addLine();
            pdf.setFont("roboto", "normal");
            _pushText(paiementSettings?.iban || "", 30 + 10);
            _addLine();
            _addLine();
            _addLine();
            pdf.setTextColor(128, 128, 128);
            _pushText("Paiement acceptés par carte bancaire , espéces", 30 + 10);
            _addLine();
            _addLine();

            pdf.setFontSize(6);
            _addLine();
            pdf.setTextColor(0, 0, 0);
            _pushText("En cas de retard, une pénalité au taux de 5% sera appliqué - TVA non applicable, art. 293B du CGI", 30);

            pdf.setFontSize(10);
            _pushText("Page " + numPage + " / " + totalPage, pdf.internal.pageSize.getWidth() - 80);
        }
        await pdf.save('Devis_' + (devis.id || 0).toString().padStart(5, "0") + '.pdf', { returnPromise: true });

        return {};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(devis);