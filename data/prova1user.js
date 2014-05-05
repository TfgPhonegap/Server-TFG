[

    { name: 'Batman', description:'gotham lloc', avatar: 'img/avatars/batman.jpg', 
    ubicacions: [
                {
                  data: "01-01-2014",
                  lloc: "Boston",
                  comentari: "Comentari user"
                },
                {
                  data: "24-11-1991",
                  lloc: "Orlando",
                  comentari: "Comentari user"
                }
              ],

    accessos: [
    { data: '01-05-2001', accessosDia: [
        {hora: '08:00', lloc: 'Entrada', resultat: true},
        {hora: '15:03', lloc: 'Porta A', resultat: true},
        {hora: '20:00', lloc: 'Restaurant', resultat: true}      
      ]},
    {
      data: '01-10-3000', accessosDia: [
        {hora: '07:00', lloc: 'Entrada', resultat: false},
        {hora: '12:00', lloc: 'Porta A', resultat: true},
        {hora: '16:00', lloc: 'Porta XXX', resultat: false}      
      ]
      }]
   }
]