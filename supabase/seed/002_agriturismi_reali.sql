-- ============================================================
-- agriturismi.app — Seed: 30 agriturismi reali italiani
-- Fonte: dati pubblici dai siti ufficiali delle strutture.
-- Descrizioni originali — non copiate da altri portali.
-- Eseguire come service role (bypass RLS).
-- ============================================================

INSERT INTO agriturismi (
  slug, nome, descrizione, regione, provincia, comune, indirizzo,
  lat, lng, telefono, email, sito_web,
  servizi, tipo_ospitalita, verificato, attivo
) VALUES

-- ─── TOSCANA (1/5) ───────────────────────────────────────────
(
  'castello-di-volpaia',
  'Castello di Volpaia',
  'Tra i borghi medievali più suggestivi del Chianti Classico, Castello di Volpaia è un''azienda agricola a conduzione familiare che produce vino, olio e aceto fin dal XV secolo. Situato a 620 metri sul livello del mare nel comune di Radda in Chianti, ospita in appartamenti e case coloniche restaurate all''interno del borgo storico. I vigneti a sangiovese regalano panorami mozzafiato sulle colline senesi con denominazione Chianti Classico DOCG. Le degustazioni guidate in cantina e la vendita diretta di olio biologico completano l''esperienza.',
  'Toscana', 'Siena', 'Radda in Chianti',
  'Loc. Volpaia, 53017 Radda in Chianti SI',
  43.5166399, 11.3787253,
  '+39 0577 738066', 'agriturismo@volpaia.com', 'https://www.volpaia.com',
  ARRAY['degustazione vini','produzione olio','vendita diretta prodotti','biologico'],
  ARRAY['appartamenti','camere'],
  false, true
),

-- ─── TOSCANA (2/5) ───────────────────────────────────────────
(
  'fattoria-poggio-alloro',
  'Fattoria Poggio Alloro',
  'A pochi minuti dal centro storico di San Gimignano, patrimonio dell''umanità UNESCO, la Fattoria Poggio Alloro si estende su oltre 140 ettari di colline toscane coltivate a vigneto, oliveto e cereali. Le antiche case coloniche ristrutturate ospitano camere e appartamenti con caratteristiche architettoniche in pietra e cotto. La produzione principale comprende la Vernaccia di San Gimignano DOCG, l''olio extravergine di oliva e lo zafferano coltivato secondo tradizione locale.',
  'Toscana', 'Siena', 'San Gimignano',
  'Via Sant''Andrea 23, 53037 San Gimignano SI',
  43.4875, 11.0642,
  '+39 0577 950011', 'info@fattoriapoggioalloro.com', 'https://www.poggioalloro.com',
  ARRAY['degustazione vini','produzione olio','biologico','vendita diretta prodotti'],
  ARRAY['camere','appartamenti'],
  false, true
),

-- ─── TOSCANA (3/5) ───────────────────────────────────────────
(
  'agriturismo-la-pieve-magliano',
  'Agriturismo La Pieve',
  'Nel cuore della Maremma grossetana, l''Agriturismo La Pieve si trova immerso negli ulivi e nei boschi del comune di Magliano in Toscana. L''antica casa colonica ristrutturata offre un''ospitalità autentica a stretto contatto con la natura e la produzione agricola locale. I dintorni conservano tracce etrusche e medievali, con il borgo di Magliano in Toscana che domina la pianura maremmana con le sue mura intatte. L''azienda produce olio extravergine biologico da cultivar autoctone.',
  'Toscana', 'Grosseto', 'Magliano in Toscana',
  'Loc. Marsiliana, 58051 Magliano in Toscana GR',
  42.65896, 11.313309,
  NULL, 'agriturismolapievedigianna@gmail.com', NULL,
  ARRAY['produzione olio','biologico','fattoria didattica'],
  ARRAY['camere','appartamenti'],
  false, true
),

-- ─── TOSCANA (4/5) ───────────────────────────────────────────
(
  'il-borghetto-country-inn',
  'Il Borghetto Country Inn',
  'Nel cuore del Chianti Fiorentino, tra le dolci colline di Montefiridolfi, Il Borghetto è un''azienda agricola di famiglia che produce vino Chianti Classico e olio extravergine biologici. Il country inn, ricavato dal casale rurale restaurato, combina i muri in pietra serena e i soffitti in legno originali con il comfort contemporaneo. A soli 20 km da Firenze, è la scelta ideale per chi vuole vivere la campagna toscana senza rinunciare alla prossimità alla città d''arte.',
  'Toscana', 'Firenze', 'San Casciano in Val di Pesa',
  'Via Collina Sant''Angelo 21, 50026 San Casciano in Val di Pesa FI',
  43.5893, 11.1858,
  '+39 055 824 4442', 'info@borghetto.org', 'https://www.borghetto.org',
  ARRAY['degustazione vini','produzione olio','piscina','biologico'],
  ARRAY['camere','suite'],
  false, true
),

-- ─── TOSCANA (5/5) ───────────────────────────────────────────
(
  'podere-il-casale-pienza',
  'Podere Il Casale',
  'A pochi chilometri da Pienza, città ideale del Rinascimento nel cuore della Val d''Orcia patrimonio UNESCO, Podere Il Casale è un''azienda agricola biologica certificata che produce latte e formaggi di capra, vino e olio extravergine. L''agriturismo ospita in camere e appartamenti affacciati sui celebri paesaggi di cipressi, poderi e crete senesi. Gli ospiti possono visitare il caseificio, partecipare alla mungitura e scoprire da vicino la vita di fattoria autentica.',
  'Toscana', 'Siena', 'Pienza',
  'Podere Il Casale, 53026 Pienza SI',
  43.080901, 11.711618,
  '+39 0578 748106', 'info@podereilcasale.it', 'https://www.podereilcasale.it',
  ARRAY['biologico','produzione olio','fattoria didattica','vendita diretta prodotti'],
  ARRAY['camere','appartamenti'],
  false, true
),

-- ─── UMBRIA (1/5) ────────────────────────────────────────────
(
  'le-silve-di-armenzano',
  'Le Silve di Armenzano',
  'Nelle campagne silenziose di Armenzano, a pochi chilometri dal centro di Assisi, Le Silve è un agriturismo di charme immerso in un bosco di querce e lecci sulle colline umbre. La struttura, ricavata da un antico casale medievale, propone camere e suite in pietra con vista sulle valli dell''Umbria e un ristorante che valorizza i prodotti locali. L''azienda agricola produce olio extravergine di oliva, miele e conserve stagionali, con la Basilica di San Francesco raggiungibile in pochi minuti.',
  'Umbria', 'Perugia', 'Assisi',
  'Loc. Armenzano, 06081 Assisi PG',
  43.084683, 12.699806,
  '+39 075 801 9000', 'info@lesilve.it', 'https://www.lesilve.it',
  ARRAY['ristorante','piscina','produzione olio','biologico'],
  ARRAY['camere','suite'],
  false, true
),

-- ─── UMBRIA (2/5) ────────────────────────────────────────────
(
  'agriturismo-il-morino',
  'Agriturismo Il Morino',
  'In posizione tranquilla a Bastia Umbra, nella pianura umbra tra Assisi e Perugia, l''Agriturismo Il Morino offre alloggio in un contesto agricolo autentico a pochi minuti dai principali centri d''arte umbri. Le camere confortevoli e gli appartamenti per famiglie sono immersi nella campagna coltivata a cereali e olivi. La colazione è servita con prodotti dell''orto e del territorio, e la struttura è una base ideale per visitare Assisi, Perugia, Spello e il Lago Trasimeno.',
  'Umbria', 'Perugia', 'Bastia Umbra',
  'Via del Morino, 06083 Bastia Umbra PG',
  43.069, 12.582,
  NULL, NULL, 'https://www.ilmorinoassisi.it',
  ARRAY['biologico','produzione olio'],
  ARRAY['camere','appartamenti'],
  false, true
),

-- ─── UMBRIA (3/5) ────────────────────────────────────────────
(
  'fattoria-di-vibio',
  'Fattoria di Vibio',
  'Sulle colline che dominano la valle del Tevere in Umbria, tra Todi e Perugia, la Fattoria di Vibio è un agriturismo di charme immerso in un paesaggio di ulivi, vigneti e boschi medievali. Le case coloniche ristrutturate ospitano appartamenti spaziosi con camini, affacciati sulle campagne umbre che si perdono fino all''orizzonte. L''azienda produce olio extravergine biologico e miele, mentre il teatro più piccolo del mondo a Montecastello di Vibio è raggiungibile a piedi.',
  'Umbria', 'Perugia', 'Montecastello di Vibio',
  'Loc. Buchella 9, 06057 Montecastello di Vibio PG',
  42.8353, 12.3486,
  '+39 075 874 9607', 'booking@fattoriadivibio.com', 'https://www.fattoriadivibio.com',
  ARRAY['piscina','produzione olio','biologico'],
  ARRAY['appartamenti'],
  false, true
),

-- ─── UMBRIA (4/5) ────────────────────────────────────────────
(
  'tenuta-di-murlo',
  'Tenuta di Murlo',
  'A breve distanza da Perugia, la Tenuta di Murlo è un agriturismo di campagna immerso in dolci colline umbre coltivate a vigneto, oliveto e cereali biologici. La struttura ospita in camere e appartamenti in un casale rurale ristrutturato, circondato da 60 ettari di terreno con produzione di vino Umbria IGT e olio extravergine DOP Umbria. Gli ospiti possono partecipare alle attività agricole e utilizzare la piscina panoramica con vista sulle valli umbre.',
  'Umbria', 'Perugia', 'Perugia',
  'Loc. Murlo, 06134 Perugia PG',
  43.2248696, 12.3400237,
  NULL, 'info@murlo.com', 'https://www.murlo.com',
  ARRAY['degustazione vini','produzione olio','piscina','biologico'],
  ARRAY['camere','appartamenti'],
  false, true
),

-- ─── UMBRIA (5/5) ────────────────────────────────────────────
(
  'locanda-del-gallo',
  'Locanda del Gallo',
  'Tra le pendici del Monte Ingino e le campagne che circondano Gubbio, la Locanda del Gallo è un agriturismo di charme ricavato da un antico casale medievale interamente restaurato. L''edificio ospita camere eleganti arredate con tessuti artigianali e pezzi d''antiquariato, con giardino e piscina panoramica sulle colline umbre. La cucina della locanda valorizza i prodotti locali con ricette della tradizione umbra, con Gubbio e la sua piazza medievale raggiungibili in pochi minuti.',
  'Umbria', 'Perugia', 'Gubbio',
  'Loc. Santa Cristina 19, 06024 Gubbio PG',
  43.3505057, 12.5737522,
  '+39 075 922 9912', 'info@locandadelgallo.it', 'https://www.locandadelgallo.it',
  ARRAY['ristorante','piscina','produzione olio'],
  ARRAY['camere'],
  false, true
),

-- ─── SICILIA (1/5) ───────────────────────────────────────────
(
  'agriturismo-limoneto-siracusa',
  'Agriturismo Limoneto',
  'Nelle campagne siracusane, l''Agriturismo Limoneto è immerso in un''antica tenuta di agrumi che profuma di zagare nella stagione della fioritura primaverile. La famiglia conduce l''azienda con metodo biologico, producendo limoni, arance, mandarini e bergamotti destinati alla trasformazione in marmellate, succhi e canditi artigianali. Le camere genuine propongono una cucina tradizionale siciliana con i prodotti dell''orto, mentre Siracusa con l''isola di Ortigia è raggiungibile in pochi chilometri.',
  'Sicilia', 'Siracusa', 'Siracusa',
  'Contrada Limoneto, 96100 Siracusa SR',
  37.0753, 15.2836,
  NULL, 'info@limoneto.it', 'https://www.limoneto.it',
  ARRAY['biologico','produzione olio','vendita diretta prodotti','ristorante'],
  ARRAY['camere'],
  false, true
),

-- ─── SICILIA (2/5) ───────────────────────────────────────────
(
  'feudo-arancio',
  'Feudo Arancio',
  'Immerso nelle dolci colline della Sicilia centro-occidentale, il Feudo Arancio si estende su oltre 500 ettari di vigneti nel territorio di Sambuca di Sicilia producendo vini d''eccellenza come Nero d''Avola, Grillo e Fiano da vitigni autoctoni siciliani. La tenuta propone enoturismo con degustazioni guidate nella cantina moderna e visite ai vigneti per scoprire il terroir unico della Sicilia occidentale. Il paesaggio con la Valle dei Templi di Agrigento e il lago artificiale Arancio completa un''esperienza tra vino e archeologia.',
  'Sicilia', 'Agrigento', 'Sambuca di Sicilia',
  'Contrada Gurra di Mare, 92017 Sambuca di Sicilia AG',
  37.6422, 13.1064,
  NULL, 'info@feudoarancio.it', 'https://www.feudoarancio.it',
  ARRAY['degustazione vini','vendita diretta prodotti'],
  ARRAY['camere'],
  false, true
),

-- ─── SICILIA (3/5) ───────────────────────────────────────────
(
  'tenuta-rasocolmo',
  'Tenuta Rasocolmo',
  'Sulla costa tirrenica del messinese, la Tenuta Rasocolmo è immersa in un agrumeto biologico di antiche varietà siciliane con vista sullo Stretto di Messina. La proprietà ospita in camere e appartamenti ristrutturati all''interno della tenuta storica, circondati da limoni, arance e bergamotti coltivati con metodo biologico. La cucina celebra i sapori dello Stretto con ricette della tradizione messinese, mentre la piscina panoramica offre viste uniche sui Monti Peloritani.',
  'Sicilia', 'Messina', 'Messina',
  'Via Rasocolmo, 98166 Messina ME',
  38.295593, 15.52351,
  NULL, 'info@tenutarasocolmo.com', 'https://www.tenutarasocolmo.com',
  ARRAY['biologico','produzione olio','piscina','vendita diretta prodotti'],
  ARRAY['camere','appartamenti'],
  false, true
),

-- ─── SICILIA (4/5) ───────────────────────────────────────────
(
  'il-limoneto-acireale',
  'Agriturismo Il Limoneto',
  'Sulle pendici dell''Etna, nel territorio di Acireale affacciato sul Mar Ionio, l''Agriturismo Il Limoneto si trova in un''area di straordinaria bellezza naturale tra le colate laviche e il mare. L''azienda coltiva agrumi biologici — limoni, arance, mandarini — in tipici terrazzamenti con muri a secco in pietra lavica. Gli ospiti alloggiano nell''antico casale con vista sull''Etna e cucina catanese autentica, mentre Taormina e le Gole dell''Alcantara sono facilmente raggiungibili.',
  'Sicilia', 'Catania', 'Acireale',
  'Contrada Scillichenti, 95024 Acireale CT',
  37.651193, 15.167878,
  NULL, 'info@illimoneto.it', 'https://www.illimoneto.it',
  ARRAY['biologico','vendita diretta prodotti','ristorante'],
  ARRAY['camere'],
  false, true
),

-- ─── SICILIA (5/5) ───────────────────────────────────────────
(
  'baglio-spano',
  'Baglio Spanò',
  'In piena campagna trapanese, nel territorio di Petrosino a poca distanza da Marsala e dalle Saline di Trapani, il Baglio Spanò è un antico casale siciliano circondato da vigneti e uliveti. La struttura restaurata ospita in camere e suite con arredi in pietra e terracotta, producendo vino Marsala DOC e vini da vitigni autoctoni come Grillo, Catarratto e Nero d''Avola. La vicinanza all''Isola di Mozia, antico insediamento fenicio, rende il baglio una base ideale per esplorare la Sicilia occidentale.',
  'Sicilia', 'Trapani', 'Petrosino',
  'Contrada Ciancio Minaudo, 91020 Petrosino TP',
  37.7052, 12.5024,
  NULL, 'info@bagliospano.com', 'https://www.bagliospano.com',
  ARRAY['degustazione vini','produzione olio','vendita diretta prodotti'],
  ARRAY['camere','suite'],
  false, true
),

-- ─── PUGLIA (1/5) ────────────────────────────────────────────
(
  'masseria-torre-coccaro',
  'Masseria Torre Coccaro',
  'A Savelletri di Fasano, nel cuore della Valle d''Itria, la Masseria Torre Coccaro è una struttura di lusso ricavata da un''antica masseria settecentesca circondata da ulivi millenari e dalla storica torre saracena. I 36 ettari di proprietà ospitano vigneti, oliveti, orti e suite con piscina privata, spa e ristorante gourmet pugliese con accesso diretto alla spiaggia sul mare Adriatico. L''olio extravergine prodotto dagli ulivi ultracentenari è disponibile per la vendita diretta.',
  'Puglia', 'Brindisi', 'Fasano',
  'Via Coccaro 1, 72015 Savelletri di Fasano BR',
  40.871209, 17.448692,
  NULL, 'info@masseriatorrecoccaro.com', 'https://www.masseriatorrecoccaro.com',
  ARRAY['spa','piscina','ristorante','spiaggia privata','produzione olio','degustazione vini'],
  ARRAY['suite','camere'],
  false, true
),

-- ─── PUGLIA (2/5) ────────────────────────────────────────────
(
  'masseria-il-frantoio-ostuni',
  'Masseria Il Frantoio',
  'Sulla Statale 16 tra Ostuni e Fasano, la Masseria Il Frantoio è un''azienda agricola biologica immersa in un uliveto di piante ultracentenari, con un antico frantoio ipogeo scavato nella roccia ancora funzionante. Le camere e i trulli ristrutturati offrono alloggio autentico nel cuore della campagna pugliese, mentre il ristorante serve una cucina biologica stagionale con i prodotti dell''orto e dell''azienda. Escursioni in bici tra gli uliveti e lezioni di cucina pugliese completano l''esperienza.',
  'Puglia', 'Brindisi', 'Ostuni',
  'SS 16 Adriatica km 874, 72017 Ostuni BR',
  40.7281, 17.5741,
  '+39 0831 330276', 'prenota@masseriailfrantoio.it', 'https://www.masseriailfrantoio.it',
  ARRAY['ristorante','piscina','biologico','produzione olio','corsi di cucina','noleggio bici'],
  ARRAY['camere','trulli'],
  false, true
),

-- ─── PUGLIA (3/5) ────────────────────────────────────────────
(
  'masseria-montenapoleone',
  'Masseria Montenapoleone',
  'Nelle campagne di Pezze di Greco nel comune di Fasano, la Masseria Montenapoleone è un agriturismo elegante circondato da ulivi millenari e vigneti biologici in un casolare in pietra calcarea restaurato. L''azienda produce vino Primitivo di Manduria DOC, olio extravergine biologico e verdure stagionali dell''orto, disponibili per degustazioni e acquisto diretto. La piscina con vista sulla campagna pugliese e i trattamenti benessere completano un''esperienza raffinata, con Alberobello raggiungibile in meno di mezz''ora.',
  'Puglia', 'Brindisi', 'Fasano',
  'Contrada Montenapoleone, 72015 Pezze di Greco (Fasano) BR',
  40.810144, 17.434294,
  NULL, 'info@masseriamontenapoleone.com', 'https://www.masseriamontenapoleone.com',
  ARRAY['degustazione vini','piscina','produzione olio','biologico'],
  ARRAY['camere','suite'],
  false, true
),

-- ─── PUGLIA (4/5) ────────────────────────────────────────────
(
  'masseria-potenti',
  'Masseria Potenti',
  'Nel territorio di Manduria in provincia di Taranto, la Masseria Potenti è immersa nei vigneti di Primitivo DOC che danno vita a uno dei vini rossi più celebri d''Italia. L''agriturismo ospita in un casale rurale ristrutturato e propone degustazioni guidate del Primitivo di Manduria con visite ai vigneti di antiche piante ad alberello pugliese. Il paesaggio attorno alla masseria, tra ulivi e viti con i colori caldi dell''entroterra tarantino, è completato dall''offerta culturale di Taranto e del MARTA.',
  'Puglia', 'Taranto', 'Manduria',
  'Contrada Potenti, 74024 Manduria TA',
  40.3990, 17.6362,
  NULL, 'info@masseriapotenti.it', 'https://www.masseriapotenti.it',
  ARRAY['degustazione vini','vendita diretta prodotti'],
  ARRAY['camere'],
  false, true
),

-- ─── PUGLIA (5/5) ────────────────────────────────────────────
(
  'masseria-salinola',
  'Masseria Salinola',
  'Nella campagna di Ostuni, la Città Bianca della Puglia, la Masseria Salinola è immersa in un uliveto biologico di piante ultracentenari a pochi minuti dal mare Adriatico. L''ospitalità di charme si esprime in suite e camere ricavate dagli antichi ambienti della masseria, con spa, piscina con idromassaggio e ristorante di cucina pugliese tradizionale. L''olio extravergine dell''uliveto biologico e il riconoscimento da testate come The Guardian e Vanity Fair ne fanno un riferimento del turismo di qualità in Puglia.',
  'Puglia', 'Brindisi', 'Ostuni',
  'Contrada Salinola, 72017 Ostuni BR',
  40.706283, 17.589052,
  '+39 0831 308330', 'booking@masseriasalinola.it', 'https://www.masseriasalinola.it',
  ARRAY['spa','piscina','ristorante','produzione olio','biologico'],
  ARRAY['suite','camere'],
  false, true
),

-- ─── LAZIO (1/5) ─────────────────────────────────────────────
(
  'tenuta-pietra-porzia',
  'Tenuta di Pietra Porzia',
  'Sui Colli Albani, nel comune di Frascati a pochi chilometri da Roma, la Tenuta di Pietra Porzia è un''azienda agricola storica immersa nei vigneti che producono il celebre Frascati DOC. La villa padronale e gli annessi rurali di origini settecentesche ospitano in ambienti eleganti con degustazioni dei vini bianchi dei Castelli Romani, accompagnate da prodotti tipici locali. La vicinanza all''area metropolitana romana rende la tenuta una meta ideale per una fuga dalla capitale.',
  'Lazio', 'Roma', 'Frascati',
  'Via di Pietra Porzia, 00044 Frascati RM',
  41.810, 12.695,
  NULL, 'info@tenutadipietraporzia.it', 'https://www.tenutadipietraporzia.it',
  ARRAY['degustazione vini','produzione olio'],
  ARRAY['camere'],
  false, true
),

-- ─── LAZIO (2/5) ─────────────────────────────────────────────
(
  'casale-di-martignano',
  'Casale di Martignano',
  'All''interno del Parco Naturale Regionale di Bracciano-Martignano, il Casale di Martignano si affaccia sulle acque cristalline del Lago di Martignano, di origine vulcanica e incontaminato. La struttura offre camere con accesso diretto alla spiaggia lacustre, canoa, pedalò e un''area dog-beach, con il ristorante aperto il sabato sera con piatti della tradizione laziale. Un''oasi di verde a meno di 40 km da Roma per chi cerca silenzio e natura autentica.',
  'Lazio', 'Roma', 'Campagnano di Roma',
  'Strada di Martignano, 00063 Campagnano di Roma RM',
  42.1357, 12.2290,
  '+39 06 99802004', 'info@martignano.com', 'https://www.casaledimartignano.it',
  ARRAY['ristorante','spiaggia privata','canoa','fattoria didattica'],
  ARRAY['camere'],
  false, true
),

-- ─── LAZIO (3/5) ─────────────────────────────────────────────
(
  'agriturismo-arlena-bolsena',
  'Agriturismo Arlena',
  'Affacciato sul Lago di Bolsena, il più grande lago vulcanico d''Europa, l''Agriturismo Arlena ospita in appartamenti indipendenti a 200 metri dalla spiaggia privata sul lago. Dall''imbarcadero privato partono le escursioni in barca alle isole vulcaniche di Bisentina e Martana, mentre canoa, vela e windsurf sono a disposizione degli ospiti. I vigneti del territorio producono l''Est! Est!! Est!!! di Montefiascone, disponibile nelle degustazioni in loco.',
  'Lazio', 'Viterbo', 'Bolsena',
  'Via Cassia km 108, Loc. Arlena, 01023 Bolsena VT',
  42.60425, 11.99592,
  '+39 391 7512328', 'info@arlena.it', 'https://www.arlena.it',
  ARRAY['spiaggia privata','canoa','noleggio bici','degustazione vini'],
  ARRAY['appartamenti'],
  false, true
),

-- ─── LAZIO (4/5) ─────────────────────────────────────────────
(
  'agriturismo-borgodoro',
  'Agriturismo Borgodoro',
  'Nelle dolci colline della Sabina, tra Rieti e Roma, l''Agriturismo Borgodoro è una fattoria biologica di lusso che produce olio d''oliva DOP Sabina, vino e ortaggi biologici. La struttura offre suite e appartamenti in un borgo rurale ristrutturato con piscina panoramica, jacuzzi all''aperto, sauna e un''osteria con cucina genuina stagionale. La Sabina, culla dell''ulivo in Italia con cultivar autoctone come Carboncella e Leccino, regala paesaggi di ulivi argentati sulle valli del Tevere.',
  'Lazio', 'Rieti', 'Magliano Sabina',
  'Vocabolo Campana, 02046 Magliano Sabina RI',
  42.36, 12.48,
  '+39 393 9098293', 'info@borgodoro.com', 'https://www.borgodoro.com',
  ARRAY['piscina','ristorante','biologico','produzione olio','spa'],
  ARRAY['suite','appartamenti'],
  false, true
),

-- ─── LAZIO (5/5) ─────────────────────────────────────────────
(
  'tenuta-quarto-santa-croce',
  'Tenuta Quarto Santa Croce',
  'Ai piedi dei Castelli Romani nel comune di Frascati, la Tenuta Quarto Santa Croce propone 13 camere con vista sui vigneti di Frascati DOC e una cucina romana tradizionale rivisitata con i prodotti dell''azienda. La grotta-cantina scavata nel tufo vulcanico custodisce le botti di affinamento dei vini bianchi dei Castelli Romani, mentre la pasticceria annessa produce dolci tipici della tradizione laziale. Roma è raggiungibile in meno di 30 minuti, ideale per vivere la campagna laziale vicino alla capitale.',
  'Lazio', 'Roma', 'Frascati',
  'Via di Pietra Porzia 24, 00044 Frascati RM',
  41.8264933, 12.687932,
  '+39 06 94010626', 'info@tenutaquartosantacroce.it', 'https://www.tenutaquartosantacroce.it',
  ARRAY['ristorante','degustazione vini','vendita diretta prodotti'],
  ARRAY['camere'],
  false, true
),

-- ─── PIEMONTE (1/5) ──────────────────────────────────────────
(
  'agriturismo-il-bricco-treiso',
  'Agriturismo Il Bricco',
  'Sulle colline delle Langhe, nel comune di Treiso in provincia di Cuneo, l''Agriturismo Il Bricco è immerso nei vigneti di Barbaresco DOCG e Dolcetto d''Alba, nel cuore del territorio UNESCO delle Langhe. Il cascinale langarolo ristrutturato offre camere a stretto contatto con i filari di nebbiolo che in autunno si tingono di rosso dorato. Degustazioni di Barbaresco, Dolcetto d''Alba e Barbera d''Alba completano il soggiorno, con la Fiera del Tartufo Bianco di Alba raggiungibile in pochi chilometri.',
  'Piemonte', 'Cuneo', 'Treiso',
  'Loc. Bricco 4, 12050 Treiso CN',
  44.6648, 8.0554,
  NULL, 'info@agriturismoilbricco.it', 'https://www.agriturismoilbricco.it',
  ARRAY['degustazione vini','vendita diretta prodotti'],
  ARRAY['camere'],
  false, true
),

-- ─── PIEMONTE (2/5) ──────────────────────────────────────────
(
  'locanda-la-raia',
  'Locanda La Raia',
  'Nel cuore del Monferrato, a Gavi in provincia di Alessandria, la Locanda La Raia è un agriturismo di lusso immerso in 180 ettari di tenuta agricola biodinamica certificata Demeter. La cantina produce il Gavi DOCG da uve cortese secondo i principi dell''agricoltura biodinamica, mentre la locanda ospita in suite eleganti con opere d''arte contemporanea internazionale. Il parco sculture all''aperto e il Monferrato UNESCO completano un''esperienza culturale e rurale di alto profilo.',
  'Piemonte', 'Alessandria', 'Gavi',
  'Loc. Raia, 15066 Gavi AL',
  44.716496, 8.7984628,
  NULL, 'locanda@la-raia.it', 'https://www.la-raia.it',
  ARRAY['degustazione vini','biologico','vendita diretta prodotti'],
  ARRAY['suite','camere'],
  false, true
),

-- ─── PIEMONTE (3/5) ──────────────────────────────────────────
(
  'cascina-alberta',
  'Cascina Alberta',
  'Sulle colline del Monferrato Casalese, nel comune di Vignale Monferrato in provincia di Alessandria, la Cascina Alberta è un agriturismo familiare immerso nei vigneti di Barbera d''Asti DOCG e Grignolino del Monferrato Casalese. L''antica cascina piemontese ristrutturata ospita in camere e appartamenti con arredi d''epoca e viste panoramiche sulle colline del Monferrato patrimonio UNESCO. La produzione vinicola valorizza i vitigni autoctoni — Barbera, Grignolino, Freisa — con degustazioni e vendita diretta.',
  'Piemonte', 'Alessandria', 'Vignale Monferrato',
  'Via al Castello 2, 15049 Vignale Monferrato AL',
  45.0082, 8.3546,
  NULL, 'cascinalberta@netcomp.it', NULL,
  ARRAY['degustazione vini','vendita diretta prodotti'],
  ARRAY['camere','appartamenti'],
  false, true
),

-- ─── PIEMONTE (4/5) ──────────────────────────────────────────
(
  'tenuta-carretta',
  'Tenuta Carretta',
  'Nel Roero, la collina piemontese che si affaccia sul Tanaro di fronte alle Langhe, la Tenuta Carretta è un''azienda vitivinicola storica di Piobesi d''Alba con oltre tre secoli di storia vinicola. I vigneti si estendono su 65 ettari tra Roero e Langhe producendo Barolo DOCG, Barbera d''Alba, Roero Arneis DOCG e Nebbiolo d''Alba. Le degustazioni guidate in cantina permettono di scoprire il territorio del Roero, meno noto delle Langhe ma altrettanto affascinante.',
  'Piemonte', 'Cuneo', 'Piobesi d''Alba',
  'Fraz. Carretta 2, 12040 Piobesi d''Alba CN',
  44.7358, 7.9834,
  NULL, 'info@tenutacarretta.it', 'https://www.tenutacarretta.it',
  ARRAY['degustazione vini','vendita diretta prodotti'],
  ARRAY['camere'],
  false, true
),

-- ─── PIEMONTE (5/5) ──────────────────────────────────────────
(
  'ca-brusa-monforte',
  'Agriturismo Ca'' Brusà',
  'In pieno territorio Barolo, nel comune di Monforte d''Alba sulle Langhe patrimonio UNESCO, l''Agriturismo Ca'' Brusà offre sei camere immerse nei vigneti di nebbiolo con viste mozzafiato sui borghi collinari. Il ristorante serve la cucina tipica delle Langhe — tajarin al tartufo, agnolotti del plin, brasato al Barolo — accompagnata dai vini aziendali tra cui Barolo DOCG e Langhe Nascetta. La cantina è aperta per visite e degustazioni, con Monforte d''Alba raggiungibile a piedi dalla struttura.',
  'Piemonte', 'Cuneo', 'Monforte d''Alba',
  'Loc. Manzoni 25, 12065 Monforte d''Alba CN',
  44.58524, 7.94687,
  '+39 0173 78169', 'info@cabrusa.com', 'https://www.cabrusa.com',
  ARRAY['ristorante','degustazione vini','vendita diretta prodotti'],
  ARRAY['camere'],
  false, true
)

ON CONFLICT (slug) DO NOTHING;
