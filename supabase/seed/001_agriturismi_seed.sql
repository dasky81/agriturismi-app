-- =============================================================
-- agriturismi.app – Seed iniziale: 20 agriturismi di fantasia
-- Distribuzione: Toscana (3), Umbria (3), Sicilia (3),
--                Puglia (3), Lazio (2), Piemonte (3), Veneto (3)
-- =============================================================

insert into agriturismi
  (slug, nome, descrizione, regione, provincia, comune, indirizzo,
   lat, lng, telefono, email,
   servizi, tipo_ospitalita, verificato, attivo)
values

-- ============================================================
-- TOSCANA
-- ============================================================

(
  'podere-belvedere-castelnuovo',
  'Podere Belvedere',
  'Immerso tra i vigneti del Chianti Classico, il Podere Belvedere è un casale del Settecento '
  'sapientemente restaurato che conserva i pavimenti in cotto e i soffitti a volta originali. '
  'Circondate da cipressi e oliveti, le camere godono di una vista mozzafiato sulle colline senesi. '
  'La cantina di proprietà produce Chianti Classico DOCG e offre degustazioni guidate al tramonto.',
  'Toscana', 'Siena', 'Castelnuovo Berardenga',
  'Loc. Podere Belvedere 12, 53019 Castelnuovo Berardenga SI',
  43.3501, 11.3312,
  '+39 0577 355412', 'info@poderebelvedere-chianti.it',
  ARRAY['piscina', 'ristorante', 'Wi-Fi', 'parcheggio', 'degustazione vini', 'trekking'],
  ARRAY['B&B', 'appartamento'],
  false, true
),

(
  'fattoria-colle-alto-greve',
  'Fattoria Colle Alto',
  'La Fattoria Colle Alto si trova nel cuore del Chianti Fiorentino, a due passi da Greve in Chianti, '
  'lungo un antico percorso della Via Chiantigiana. I quattro appartamenti indipendenti, ricavati nelle '
  'ex stalle e nel fienile medievale, sono arredati con mobili d'antiquariato toscano. '
  'Gli ospiti possono partecipare alla raccolta delle olive in autunno e alla vendemmia a settembre.',
  'Toscana', 'Firenze', 'Greve in Chianti',
  'Via Chiantigiana 78, 50022 Greve in Chianti FI',
  43.5832, 11.3119,
  '+39 055 853247', 'soggiorni@fattoriacollealtO.it',
  ARRAY['Wi-Fi', 'parcheggio', 'animali ammessi', 'trekking', 'degustazione vini'],
  ARRAY['appartamento'],
  false, true
),

(
  'tenuta-san-biagio-montepulciano',
  'Tenuta San Biagio',
  'Adagiata sulle colline del Nobile, la Tenuta San Biagio si estende per quaranta ettari tra vigneti '
  'di Prugnolo Gentile, oliveti e boschi di quercia. Il corpo principale della tenuta, una villa '
  'cinquecentesca, ospita sei appartamenti con cucina e terrazza privata affacciata sulla Val di Chiana. '
  'Il ristorante dell'azienda propone una cucina stagionale abbinata ai vini di produzione propria.',
  'Toscana', 'Siena', 'Montepulciano',
  'Loc. San Biagio 5, 53045 Montepulciano SI',
  43.0961, 11.7820,
  '+39 0578 716389', 'booking@tenutasanbiagio.it',
  ARRAY['piscina', 'ristorante', 'Wi-Fi', 'parcheggio', 'degustazione vini', 'spa'],
  ARRAY['appartamento', 'B&B'],
  false, true
),

-- ============================================================
-- UMBRIA
-- ============================================================

(
  'cascina-sant-eremo-assisi',
  'Cascina Sant''Eremo',
  'Posta sulle pendici del Monte Subasio, a soli tre chilometri dal centro storico di Assisi, '
  'la Cascina Sant'Eremo è un antico eremo francescano convertito in agriturismo nel 1992. '
  'Le camere in pietra rosa umbra profumano di lavanda e affacciano sui boschi di leccio. '
  'A disposizione degli ospiti un orto biologico e un sentiero escursionistico segnalato fino alla vetta.',
  'Umbria', 'Perugia', 'Assisi',
  'Strada Monte Subasio 31, 06081 Assisi PG',
  43.0706, 12.6194,
  '+39 075 8155304', 'info@cascinasanteremo.it',
  ARRAY['ristorante', 'Wi-Fi', 'parcheggio', 'trekking', 'animali ammessi'],
  ARRAY['B&B', 'camera'],
  false, true
),

(
  'il-borgo-della-rupe-orvieto',
  'Il Borgo della Rupe',
  'Aggrappato alla roccia di tufo su cui sorge Orvieto, Il Borgo della Rupe è un insieme di case '
  'contadine del Quattrocento che formano un piccolo villaggio privato con piscina panoramica. '
  'I tre cottage in pietra, rivestiti di edera, hanno interni minimalisti con travi a vista e camini. '
  'La sera, alla luce delle candele, vengono organizzate cene con prodotti dell'orto e vino dell'azienda.',
  'Umbria', 'Terni', 'Orvieto',
  'Loc. Rupe di San Giovanale 4, 05018 Orvieto TR',
  42.7186, 12.1094,
  '+39 0763 344892', 'soggiorno@ilborgodell arupe.it',
  ARRAY['piscina', 'ristorante', 'Wi-Fi', 'parcheggio', 'degustazione vini'],
  ARRAY['appartamento', 'glamping'],
  false, true
),

(
  'agriturismo-fonte-quercia-spoleto',
  'Agriturismo Fonte Quercia',
  'Nel verde delle colline spoletine, Fonte Quercia si estende intorno a una sorgente naturale '
  'che alimenta una piccola piscina biologica. L'allevamento di cavalli Maremmani è il cuore '
  'dell'azienda: passeggiate a cavallo nei boschi e lezioni di equitazione per tutti i livelli. '
  'Gli appartamenti nel casale ottocentesco possono ospitare famiglie fino a sei persone.',
  'Umbria', 'Perugia', 'Spoleto',
  'Via Fonte Quercia 19, 06049 Spoleto PG',
  42.7337, 12.7376,
  '+39 0743 221567', 'info@fontequercia.it',
  ARRAY['parcheggio', 'Wi-Fi', 'animali ammessi', 'trekking', 'maneggio', 'area giochi bambini'],
  ARRAY['appartamento', 'B&B'],
  false, true
),

-- ============================================================
-- SICILIA
-- ============================================================

(
  'masseria-valle-d-oro-agrigento',
  'Masseria Valle d''Oro',
  'A pochi minuti dalla Valle dei Templi, la Masseria Valle d'Oro è circondata da mandorli e '
  'ulivi centenari su un pianoro che domina la costa agrigentina. Le sei camere in stile '
  'mediterraneo bianco-calce ospitano tessuti fatti a mano e pavimenti in maioliche locali. '
  'La colazione è preparata con prodotti del podere: miele di zagara, marmellate di agrumi e pane di casa.',
  'Sicilia', 'Agrigento', 'Agrigento',
  'Contrada Valle d''Oro, 92100 Agrigento AG',
  37.3115, 13.5765,
  '+39 0922 403281', 'info@masseriavalledoro.it',
  ARRAY['piscina', 'ristorante', 'Wi-Fi', 'parcheggio', 'trekking'],
  ARRAY['B&B', 'camera'],
  false, true
),

(
  'il-feudo-dell-etna-zafferana',
  'Il Feudo dell''Etna',
  'Immerso nei vigneti ad alta quota del versante est dell'Etna, Il Feudo è un antico baglio '
  'borbonico ristrutturato nel rispetto dell'architettura vulcanica in pietra lavica nera. '
  'La produzione di Etna DOC – Nerello Mascalese e Carricante – è il cuore dell'azienda, '
  'con degustazioni guidate in cantina scavata direttamente nella lava. Escursioni al cratere su richiesta.',
  'Sicilia', 'Catania', 'Zafferana Etnea',
  'Contrada Sciambro 8, 95019 Zafferana Etnea CT',
  37.6919, 15.1069,
  '+39 095 7082319', 'vini@ilfeuodoetna.it',
  ARRAY['Wi-Fi', 'parcheggio', 'degustazione vini', 'trekking', 'animali ammessi'],
  ARRAY['B&B', 'appartamento'],
  false, true
),

(
  'baglio-tramonto-marsala',
  'Baglio Tramonto',
  'Affacciato sulle saline di Marsala e sull'isola di Mozia, il Baglio Tramonto è un antico '
  'baglio del XVIII secolo immerso nelle vigne di Grillo e Catarratto della DOC Marsala. '
  'Dieci camere ampie con volte a botte, pavimenti in graniglia e vista sullo Stagnone al tramonto. '
  'La trattoria del baglio serve pesce locale, couscous alla trapanese e Marsala Vergine dell'azienda.',
  'Sicilia', 'Trapani', 'Marsala',
  'Contrada Ettore Infersa 22, 91025 Marsala TP',
  37.7984, 12.4374,
  '+39 0923 733056', 'booking@bagliotramonto.it',
  ARRAY['ristorante', 'Wi-Fi', 'parcheggio', 'degustazione vini', 'piscina'],
  ARRAY['B&B', 'glamping'],
  false, true
),

-- ============================================================
-- PUGLIA
-- ============================================================

(
  'masseria-trulli-selvatici-alberobello',
  'Masseria Trulli Selvatici',
  'Nel cuore della Valle d'Itria, la Masseria Trulli Selvatici offre l'esperienza unica di '
  'dormire in un trullo restaurato circondato da ulivi millenari e giardini di rosmarino. '
  'Ogni trullo-suite è indipendente, con cucina in pietra e terrazzino privato ombreggiato. '
  'Il mattino la proprietaria porta direttamente alla porta formaggi freschi, focaccia e orecchiette fatte a mano.',
  'Puglia', 'Bari', 'Alberobello',
  'Contrada Trullo Piccolo 7, 70011 Alberobello BA',
  40.7844, 17.2369,
  '+39 080 4321987', 'info@trulliselvatici.it',
  ARRAY['piscina', 'Wi-Fi', 'parcheggio', 'animali ammessi', 'area giochi bambini', 'ristorante'],
  ARRAY['B&B', 'appartamento'],
  false, true
),

(
  'agriturismo-ostuni-bianca-ostuni',
  'Agriturismo Ostuni Bianca',
  'A cinque chilometri dalla "Città Bianca", questo agriturismo familiare coltiva ulivi di varietà '
  'Ogliarola Salentina con metodo biologico certificato. Le sei camere, ricavate nell'antico palmento, '
  'sono decorate con calce bianca e tessuti indaco. Il frantoio aziendale è aperto alle visite: '
  'gli ospiti possono assistere alla molitura e portare a casa l'olio extravergine prodotto.',
  'Puglia', 'Brindisi', 'Ostuni',
  'Strada Provinciale 18 km 3.5, 72017 Ostuni BR',
  40.7285, 17.5787,
  '+39 0831 303142', 'soggiorno@ostuni-bianca.it',
  ARRAY['piscina', 'Wi-Fi', 'parcheggio', 'degustazione vini', 'animali ammessi'],
  ARRAY['B&B', 'camera'],
  false, true
),

(
  'il-frantoio-del-salento-lecce',
  'Il Frantoio del Salento',
  'Circondato da cinquecento ulivi ultracentenari in aperta campagna leccese, Il Frantoio del Salento '
  'è un agriturismo di charme ricavato in una masseria del 1700. I quattro appartamenti '
  'mantengono i soffitti con volte a stella e i pavimenti originali in chianche di carparo. '
  'La degustazione guidata di oli monovarietali con tarallini e formaggi pugliesi è compresa nel soggiorno.',
  'Puglia', 'Lecce', 'Carmiano',
  'Loc. Masseria Frantoio Antico, 73041 Carmiano LE',
  40.3523, 18.1747,
  '+39 0832 602788', 'info@ilfranto iosalento.it',
  ARRAY['ristorante', 'Wi-Fi', 'parcheggio', 'degustazione vini', 'piscina', 'area giochi bambini'],
  ARRAY['appartamento', 'B&B'],
  false, true
),

-- ============================================================
-- LAZIO
-- ============================================================

(
  'agriturismo-colle-etrusco-viterbo',
  'Agriturismo Colle Etrusco',
  'Sulle colline della Tuscia, a ridosso di una necropoli etrusca, il Colle Etrusco è immerso '
  'in un bosco di noccioli e querce da sughero con vista sul Lago di Vico. '
  'Le sei camere in tufo hanno pareti spesse un metro e una frescura naturale d'estate. '
  'L'agriturismo offre trekking guidato tra i siti etruschi e terme private con accesso alle sorgenti sulfuree locali.',
  'Lazio', 'Viterbo', 'Ronciglione',
  'Strada Cimina 14, 01037 Ronciglione VT',
  42.4208, 12.1052,
  '+39 0761 626034', 'info@colleetrusco.it',
  ARRAY['ristorante', 'Wi-Fi', 'parcheggio', 'trekking', 'spa', 'animali ammessi'],
  ARRAY['B&B', 'camera'],
  false, true
),

(
  'la-tenuta-della-sabina-rieti',
  'La Tenuta della Sabina',
  'Nella campagna sabina premiata dall'UNESCO come "paesaggio storico rurale", la Tenuta della Sabina '
  'produce olio DOP con olive Carboncella e alleva pecore di razza Sarda. '
  'I tre appartamenti nel rustico di pietra hanno ognuno un piccolo giardino privato con ulivo. '
  'Gli ospiti possono partecipare alla transumanza primaverile e alla caseificazione artigianale.',
  'Lazio', 'Rieti', 'Poggio Mirteto',
  'Loc. Colle del Moro 6, 02047 Poggio Mirteto RI',
  42.2321, 12.8563,
  '+39 0765 203451', 'prenotazioni@tenutasabina.it',
  ARRAY['parcheggio', 'Wi-Fi', 'trekking', 'animali ammessi', 'area giochi bambini'],
  ARRAY['appartamento', 'B&B'],
  false, true
),

-- ============================================================
-- PIEMONTE
-- ============================================================

(
  'cascina-langhe-d-autunno-alba',
  'Cascina Langhe d''Autunno',
  'Nel cuore delle Langhe patrimonio UNESCO, la Cascina Langhe d'Autunno si erge su un'altura '
  'tra vigneti di Barolo e Barbaresco con una vista a 360° sulle colline coperte di viti. '
  'Il ristorante propone la cucina langarola della tradizione – tajarin al ragù, finanziera, '
  'bagna cauda – accompagnata da una cantina con oltre duecento etichette del Piemonte.',
  'Piemonte', 'Cuneo', 'Serralunga d''Alba',
  'Borgata Falletto 3, 12050 Serralunga d''Alba CN',
  44.7015, 8.0359,
  '+39 0173 613278', 'info@cascinalanghe.it',
  ARRAY['ristorante', 'Wi-Fi', 'parcheggio', 'degustazione vini', 'trekking'],
  ARRAY['B&B', 'camera'],
  false, true
),

(
  'il-vigneto-di-nizza-monferrato',
  'Il Vigneto di Nizza',
  'L'agriturismo sorge su un'altura del Monferrato dominata da un'antica torre medievale '
  'che gli ospiti possono salire per ammirare i vigneti di Barbera d'Asti Superiore "Nizza DOCG". '
  'Le quattro camere arredate in stile piemontese si affacciano sui filari curatissimi. '
  'La mattina, la colazione comprende torte fatte in casa, salumi artigianali e confetture di frutta.',
  'Piemonte', 'Asti', 'Nizza Monferrato',
  'Strada Viazzo della Torre 8, 14049 Nizza Monferrato AT',
  44.7736, 8.3535,
  '+39 0141 722093', 'booking@vignetonizza.it',
  ARRAY['Wi-Fi', 'parcheggio', 'degustazione vini', 'ristorante', 'animali ammessi'],
  ARRAY['B&B', 'appartamento'],
  false, true
),

(
  'agriturismo-valle-maira-cuneo',
  'Agriturismo Valle Maira',
  'Adagiato a 900 metri di quota nella selvaggia Valle Maira, questo agriturismo di montagna '
  'è il punto di partenza ideale per escursioni sulla Rete degli Occitani e per i rifugi alpini. '
  'L'allevamento di capre Camosciate d'Alpine fornisce il latte per i formaggi artigianali serviti '
  'a tavola. Le tende glamping sul pianoro in quota sono attrezzate con stufa a legna e pavimento riscaldato.',
  'Piemonte', 'Cuneo', 'Stroppo',
  'Loc. Ferrere 4, 12020 Stroppo CN',
  44.3845, 7.5487,
  '+39 0171 999034', 'info@agrivallemAira.it',
  ARRAY['parcheggio', 'trekking', 'animali ammessi', 'maneggio', 'area giochi bambini'],
  ARRAY['glamping', 'B&B'],
  false, true
),

-- ============================================================
-- VENETO
-- ============================================================

(
  'villa-rosetta-valpolicella-negrar',
  'Villa Rosetta Valpolicella',
  'Immersa nei vigneti della Valpolicella Classica, Villa Rosetta è una dimora veneziana del '
  'Settecento con porticato ad archi e affresco sulla facciata principale. '
  'L'azienda produce Amarone della Valpolicella DOCG e Recioto con metodo dell'appassimento tradizionale: '
  'le visite alla fruttaia sono il momento più suggestivo dell'anno, da ottobre a dicembre.',
  'Veneto', 'Verona', 'Negrar di Valpolicella',
  'Via Villa Rosetta 12, 37024 Negrar di Valpolicella VR',
  45.5261, 10.9017,
  '+39 045 7500312', 'info@villarosettavalpolicella.it',
  ARRAY['piscina', 'ristorante', 'Wi-Fi', 'parcheggio', 'degustazione vini'],
  ARRAY['B&B', 'appartamento'],
  false, true
),

(
  'agriturismo-colli-euganei-galzignano',
  'Agriturismo Colli Euganei',
  'Alle pendici del Monte Cinto nel Parco Regionale dei Colli Euganei, questo agriturismo familiare '
  'coltiva vigneti di Moscato Giallo e Fior d'Arancio con metodo biologico certificato. '
  'Le sei camere in villa veneta fine Ottocento hanno soffitti affrescati e giardino botanico. '
  'A pochi minuti le famose terme di Abano e Montegrotto: convenzioni esclusive per gli ospiti.',
  'Veneto', 'Padova', 'Galzignano Terme',
  'Via Monte Cinto 27, 35030 Galzignano Terme PD',
  45.3275, 11.7333,
  '+39 049 9130215', 'prenotazioni@agriturismoeuganei.it',
  ARRAY['Wi-Fi', 'parcheggio', 'degustazione vini', 'trekking', 'spa', 'animali ammessi'],
  ARRAY['B&B', 'camera'],
  false, true
),

(
  'podere-asolano-asolo',
  'Podere Asolano',
  'Tra i colli asolani cantati da Giosuè Carducci, il Podere Asolano è un rustico di fine '
  'Ottocento con vista sulla Rocca di Asolo e sui campanili veneti all'orizzonte. '
  'I quattro loft nel fienile restaurato combinano travi originali in rovere con arredo contemporaneo. '
  'Il territorio circostante offre percorsi di cicloturismo, cantine dei vini Prosecco Superiore DOCG e mercati artigianali.',
  'Veneto', 'Treviso', 'Asolo',
  'Via Cà Dolfin 9, 31011 Asolo TV',
  45.7999, 11.9097,
  '+39 0423 952176', 'info@podereasolano.it',
  ARRAY['Wi-Fi', 'parcheggio', 'trekking', 'degustazione vini', 'animali ammessi', 'area giochi bambini'],
  ARRAY['appartamento', 'glamping'],
  false, true
);
