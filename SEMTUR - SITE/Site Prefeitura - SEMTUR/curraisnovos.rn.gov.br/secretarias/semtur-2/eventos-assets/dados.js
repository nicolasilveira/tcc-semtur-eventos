/* Dados do calendário e dos roteiros. Edite aqui para trocar eventos, programação e imagens. */
window.EVENTOS = [
 {
  "id": "1",
  "title": "Festival Cultural Currais Novos (exemplo)",
  "start": "2026-10-17",
  "categoria": "cultura",
  "local": "Praça Cel. José Bezerra",
  "descricao": "Três dias de música, dança e artesanato local com artistas da região.",
  "programacao": [
   {
    "hora": "19:00",
    "atividade": "Abertura oficial e apresentação da banda municipal"
   },
   {
    "hora": "20:00",
    "atividade": "Show de forró regional"
   },
   {
    "hora": "22:00",
    "atividade": "Quadrilha junina convidada"
   },
   {
    "hora": "Sáb 16:00",
    "atividade": "Oficinas de artesanato e feira de artistas"
   }
  ],
  "imagens": [
   "eventos-assets/img/e1-1.svg",
   "eventos-assets/img/e1-2.svg",
   "eventos-assets/img/e1-3.svg"
  ],
  "end": "2026-10-19"
 },
 {
  "id": "2",
  "title": "Corrida Rústica da Cidade (exemplo)",
  "start": "2026-10-25",
  "categoria": "esporte",
  "local": "Complexo Esportivo Municipal",
  "descricao": "Corrida de rua com percursos de 5 km e 10 km abertos ao público.",
  "programacao": [
   {
    "hora": "05:30",
    "atividade": "Retirada de kits e aquecimento coletivo"
   },
   {
    "hora": "06:30",
    "atividade": "Largada 10 km"
   },
   {
    "hora": "06:45",
    "atividade": "Largada 5 km"
   },
   {
    "hora": "08:30",
    "atividade": "Premiação e café da manhã"
   }
  ],
  "imagens": [
   "eventos-assets/img/e2-1.svg",
   "eventos-assets/img/e2-2.svg",
   "eventos-assets/img/e2-3.svg"
  ]
 },
 {
  "id": "3",
  "title": "Festival Gastronômico do Seridó (exemplo)",
  "start": "2026-11-06",
  "categoria": "gastronomia",
  "local": "Rua do Comércio, Centro",
  "descricao": "Pratos típicos, comida de rua e demonstrações com chefs locais.",
  "programacao": [
   {
    "hora": "17:00",
    "atividade": "Abertura dos estandes"
   },
   {
    "hora": "18:30",
    "atividade": "Show culinário com chef convidado"
   },
   {
    "hora": "20:00",
    "atividade": "Concurso de melhor prato típico"
   },
   {
    "hora": "21:00",
    "atividade": "Música ao vivo"
   }
  ],
  "imagens": [
   "eventos-assets/img/e3-1.svg",
   "eventos-assets/img/e3-2.svg",
   "eventos-assets/img/e3-3.svg"
  ],
  "end": "2026-11-08"
 },
 {
  "id": "4",
  "title": "Feira de Serviços da Prefeitura (exemplo)",
  "start": "2026-11-14",
  "categoria": "prefeitura",
  "local": "Ginásio Poliesportivo",
  "descricao": "Atendimento ao cidadão: documentos, saúde, cadastros e orientação jurídica.",
  "programacao": [
   {
    "hora": "08:00",
    "atividade": "Abertura e distribuição de senhas"
   },
   {
    "hora": "09:00",
    "atividade": "Atendimentos de saúde e documentação"
   },
   {
    "hora": "12:00",
    "atividade": "Intervalo"
   },
   {
    "hora": "13:30",
    "atividade": "Orientação jurídica e cadastros"
   },
   {
    "hora": "16:00",
    "atividade": "Encerramento"
   }
  ],
  "imagens": [
   "eventos-assets/img/e4-1.svg",
   "eventos-assets/img/e4-2.svg",
   "eventos-assets/img/e4-3.svg"
  ]
 },
 {
  "id": "5",
  "title": "Caminhada Ecológica ao Cânion (exemplo)",
  "start": "2026-11-21",
  "categoria": "turismo",
  "local": "Saída da Praça Central",
  "descricao": "Trilha guiada com apresentação da fauna e flora da região.",
  "programacao": [
   {
    "hora": "05:00",
    "atividade": "Concentração e saída em comboio"
   },
   {
    "hora": "06:30",
    "atividade": "Início da trilha com guias"
   },
   {
    "hora": "09:00",
    "atividade": "Parada para contemplação e lanche"
   },
   {
    "hora": "11:30",
    "atividade": "Retorno e encerramento"
   }
  ],
  "imagens": [
   "eventos-assets/img/e5-1.svg",
   "eventos-assets/img/e5-2.svg",
   "eventos-assets/img/e5-3.svg"
  ]
 }
];

window.ROTEIROS = [
 {
  "id": "1",
  "titulo": "Mina Brejuí: história da mineração",
  "descricao": "Visita ao museu e à mina que marcaram a história da scheelita na região.",
  "duracao": "3 horas",
  "capa": "eventos-assets/img/r1-1.svg",
  "imagens": [
   "eventos-assets/img/r1-1.svg",
   "eventos-assets/img/r1-2.svg",
   "eventos-assets/img/r1-3.svg"
  ],
  "roteiro": [
   {
    "hora": "09:00",
    "atividade": "Recepção e introdução histórica"
   },
   {
    "hora": "09:30",
    "atividade": "Descida guiada à mina"
   },
   {
    "hora": "11:00",
    "atividade": "Visita ao museu e coleção de minerais"
   },
   {
    "hora": "12:00",
    "atividade": "Fotos e encerramento"
   }
  ],
  "dicas": "Use calçado fechado e leve água. Confirme os horários de visitação antes da viagem."
 },
 {
  "id": "2",
  "titulo": "Cânion dos Apertados",
  "descricao": "Trilha entre paredões de rocha, ideal para quem gosta de natureza e fotografia.",
  "duracao": "Dia inteiro",
  "capa": "eventos-assets/img/r2-1.svg",
  "imagens": [
   "eventos-assets/img/r2-1.svg",
   "eventos-assets/img/r2-2.svg",
   "eventos-assets/img/r2-3.svg"
  ],
  "roteiro": [
   {
    "hora": "06:00",
    "atividade": "Saída da cidade"
   },
   {
    "hora": "07:30",
    "atividade": "Início da trilha guiada"
   },
   {
    "hora": "10:00",
    "atividade": "Parada para fotos e contemplação"
   },
   {
    "hora": "12:30",
    "atividade": "Almoço regional"
   },
   {
    "hora": "15:00",
    "atividade": "Retorno"
   }
  ],
  "dicas": "Leve protetor solar, chapéu e calçado de trilha. Evite ir sem guia."
 },
 {
  "id": "3",
  "titulo": "Açude Dourado: pôr do sol",
  "descricao": "Passeio leve para relaxar no fim de tarde, com boa vista e área para fotos.",
  "duracao": "2 horas",
  "capa": "eventos-assets/img/r3-1.svg",
  "imagens": [
   "eventos-assets/img/r3-1.svg",
   "eventos-assets/img/r3-2.svg",
   "eventos-assets/img/r3-3.svg"
  ],
  "roteiro": [
   {
    "hora": "16:00",
    "atividade": "Chegada e passeio na margem"
   },
   {
    "hora": "17:00",
    "atividade": "Lanche e área de convivência"
   },
   {
    "hora": "17:45",
    "atividade": "Pôr do sol"
   },
   {
    "hora": "18:30",
    "atividade": "Retorno"
   }
  ],
  "dicas": "Melhor em dias secos. Leve repelente."
 },
 {
  "id": "4",
  "titulo": "Centro e sabores de Currais Novos",
  "descricao": "Roteiro a pé pelo centro, com praças, comércio local e comidas típicas.",
  "duracao": "4 horas",
  "capa": "eventos-assets/img/r4-1.svg",
  "imagens": [
   "eventos-assets/img/r4-1.svg",
   "eventos-assets/img/r4-2.svg",
   "eventos-assets/img/r4-3.svg"
  ],
  "roteiro": [
   {
    "hora": "09:00",
    "atividade": "Caminhada pelas praças"
   },
   {
    "hora": "10:30",
    "atividade": "Visita ao comércio e artesanato"
   },
   {
    "hora": "12:00",
    "atividade": "Almoço com prato típico"
   },
   {
    "hora": "13:30",
    "atividade": "Sobremesa e encerramento"
   }
  ],
  "dicas": "Roteiro a pé: use roupas leves e calçado confortável."
 }
];
