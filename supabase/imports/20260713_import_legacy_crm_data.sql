-- Importacion de datos legacy CRM Aktua.
-- Seguro para reejecutar: usa upsert por id.
begin;

-- Propietarios: 6 registros
insert into crm_owners (id, created_at, name, phone, email, notes)
values
  ('0964131b-402c-4d52-8a4e-8be599f46260', '2026-07-11T17:18:06.033Z', 'Dayana COLABORADORA', '625374806', NULL, 'Tiene varias viviendas cn las que podemos colaborar y subir. HONORARIOS AL 50/50'),
  ('6bdd3c63-23e3-4cd7-9964-bbcd73d0b9df', '2026-07-11T17:19:26.030Z', 'Belén Local', '617103893', NULL, 'Tiene local de 2000€/mes. Llamar el lunes 13 julio'),
  ('78c162c2-a13d-4b48-8ae3-ced34ccb9822', '2026-07-11T17:20:24.478Z', 'Enrique', '670656765', NULL, 'Local eugenio gross 129000. Llamar el 20 de julio que se le acaba la exclusividad con Tecnocasa, el quiere mas abanico de venta osea que nos la dará'),
  ('1834ec80-9c6d-43ed-8d7a-41436b94340a', '2026-07-11T17:21:08.139Z', 'Francisco', '638484558', NULL, 'Casa en cerralba 230000. Pendiente de hacerle fotos, dice que tenia pensado hacer mejores fotos a ver si me deja ir a mi y le hago yo las fotos'),
  ('040f6b43-7942-44ab-9de9-e8820baff709', '2026-07-11T17:22:04.744Z', 'Maribel Pinzon 13', '677545862', NULL, 'Ella vendería su casa, podemos hacerle fotos pero esta la hija de mudanza y tiene la casa hecha un coño. Quiere irse a algun piso con ascensor o bajo, esta mal de la espalda. Super buena gente'),
  ('280ecc3e-2ec8-4ebf-9ef6-f16f01589f3e', '2026-07-11T17:22:36.923Z', 'Fernando', '744608467', NULL, 'Fernando tiene un hotel de 1.6 millones, y otro chiquitito de 330.000 al lado de competa')
on conflict (id) do update set created_at = excluded.created_at, name = excluded.name, phone = excluded.phone, email = excluded.email, notes = excluded.notes;


-- Clientes: 16 registros
insert into crm_clients (id, created_at, name, phone, email, interest, notes)
values
  ('cd99aa7d-c117-4490-944e-8739c99e95bd', '2026-07-11T17:04:55.392Z', 'Loli', '664340130', NULL, 'Compra', 'Interesa portada alta. Inquilino no vuelve hasta la semana del 20 de julio. Avisar para entonces'),
  ('6a8e0ccf-5edb-46ec-a8f2-3b97b8cb7127', '2026-07-11T17:05:25.268Z', 'Tamara', '622191949', NULL, 'Compra', 'Interesa finc cartama 365000 Pendiente de que sandra me confirme la zona, y el tipo de suelo'),
  ('ef105a62-84b6-41af-be70-c3a83b96df97', '2026-07-11T17:05:52.876Z', 'Kiko', '616092434', NULL, 'Compra', 'Interesa casa alora 139000. Pte confirme visita'),
  ('10778462-2b50-4a26-b0cf-7b634e59aa93', '2026-07-11T17:08:12.785Z', 'Francisco Javier', '664456305', NULL, 'Compra', 'Interesa sexmo 226000. Pendiente de que alicia vuelva de vacaciones para agedar visita. Francisco puede todas las tardes a partir de las 18:00. Pte de informar del tipo de suelo'),
  ('643d7a86-6ac2-4255-be89-7eb1ff7e8e4e', '2026-07-11T17:08:41.625Z', 'Paqui', '630633130', NULL, 'Compra', 'Interesa piso portada alta 190.000. Pte agendar visita cuando inquilino vuelva de vacaciones'),
  ('936ae51d-2430-4feb-8356-7521218b6e52', '2026-07-11T17:09:27.517Z', 'Maria Jose', '629806216', NULL, 'Compra', 'Interesa consul 413000. Pte de que Sandra me diga cuando podemos ir a verla'),
  ('548e736e-9dc0-4fd8-8a4e-90f880369d89', '2026-07-11T17:10:39.907Z', 'Diego', '616075726', NULL, 'Compra', 'Interesa sexmo 226000. Agendar visita cuando vuelva alicia propietaria de vacaciones'),
  ('0514a04f-22c7-43c8-b99a-c2d6519cf407', '2026-07-11T17:11:11.155Z', 'Jose', '635258901', NULL, 'Compra', 'Interesa portada alta 190000. Avisar cuando inquilino vuelva de vacaciones semana del 20 de julio'),
  ('f3a7621d-8660-4a9d-9bd8-41e5ad0a27c0', '2026-07-11T17:12:09.090Z', 'Jesica', '657017345', NULL, 'Compra', 'Interesa alora 139000. Busca algo por el estilo, con terreno porque tiene animaless. Buscarle algo por la zona de alhaurin el grande, no lejos de malaga. Tiene animales por lo q necesita terreno'),
  ('830aeebf-b6ba-44a4-bb8f-5d3ff9efb211', '2026-07-11T17:12:36.073Z', 'Antonio', '666945558', NULL, 'Compra', 'Interesa sexmo 226000, pero pregunta hasta cuanto se puede bajar antes de ir a verlo xd'),
  ('5ae34e75-99cf-45eb-b99a-d815332cbb6c', '2026-07-11T17:13:06.740Z', 'Rafael', '649071943', NULL, 'Compra', 'Interesa sexmo 2260000. Le pasé el enlace pero no me ha vuelto a decir nada'),
  ('fe9705ec-aced-43db-b274-9875a9b613fc', '2026-07-11T17:13:54.283Z', 'Jose', '600009501', NULL, 'Compra', 'Interesa sexmo 226000. Pte informarle sobre el tipo de suelo para el tema de la financiacion.'),
  ('c17cbbbb-0502-48d7-9076-9d5fcc745d9e', '2026-07-11T17:14:30.749Z', 'Melissa Bailey', '614714715', NULL, 'Compra', 'Interesa alora 139, busca algo por el estilo. Si le encontramos algo que comprar nos da su piso para vender.'),
  ('205eb022-99d4-4295-a5b4-7d9e516bdc9b', '2026-07-11T17:15:18.860Z', 'Ángeles', '659978423', NULL, 'Compra', 'Buscaba piso pa alquilar pa la nieta, pero ahora han pensando en comprar mejor. Buscarle algo.'),
  ('4222947b-03ce-4acd-8eaf-3a8f6d1cd321', '2026-07-11T17:15:58.718Z', 'Inma', '625097657', NULL, 'Compra', 'Busca algo x huelin 3 habitaciones'),
  ('bf881a51-1173-42fe-9147-2fb195e6aef1', '2026-07-11T17:18:39.049Z', 'Gabi Manoli', '670770135', NULL, 'Compra', 'A ver si le interesa el hotel de 1.6 millones €')
on conflict (id) do update set created_at = excluded.created_at, name = excluded.name, phone = excluded.phone, email = excluded.email, interest = excluded.interest, notes = excluded.notes;


-- Inmuebles: 10 registros
insert into crm_properties (id, created_at, title, address, price, status, details, owner_id)
values
  ('a47a8b77-6377-4a48-8dd0-20c179696698', '2026-07-10T17:20:08.142Z', 'Sexmo', NULL, 226000.0, 'Disponible', NULL, NULL),
  ('6430c256-b21e-430d-a9c1-61487e3b8b2d', '2026-07-11T17:01:29.457Z', 'Eduardo Aguilera Romera', 'Torremolinos', 148000.0, 'Disponible', '147500', NULL),
  ('b31762d1-6425-41ae-b576-21b2fef4528e', '2026-07-11T17:01:59.782Z', 'Miraflores', 'Piso Miraflores', 170000.0, 'Disponible', '169900
QUINTO sin ascensor', NULL),
  ('8e55a642-cb81-4c02-a2bb-5e3e7b9f0015', '2026-07-11T17:02:23.575Z', 'Alora', 'Alora', 139000.0, 'Disponible', 'Casa alora manuel', NULL),
  ('bc56e0de-e363-4de4-9839-66623ba53aa2', '2026-07-11T17:02:46.217Z', 'San quintin', 'distrito centro', 326000.0, 'Disponible', NULL, NULL),
  ('be247029-b196-4fc8-a2d3-8128b1467a03', '2026-07-11T17:02:59.367Z', 'Portada alta', NULL, 190000.0, 'Disponible', NULL, NULL),
  ('3c9d7530-c485-4930-8a1e-4be345d9d0fa', '2026-07-11T17:03:13.330Z', 'Finca cártama', NULL, 365000.0, 'Disponible', NULL, NULL),
  ('84726655-0c0b-49fe-841b-6caeb8878571', '2026-07-11T17:03:27.992Z', 'El consul', NULL, 413000.0, 'Disponible', NULL, NULL),
  ('302cb5e2-cfa1-42cc-89dc-a114f798f0cc', '2026-07-11T17:03:51.119Z', 'Camino suarez', NULL, 240000.0, 'Disponible', NULL, NULL),
  ('c487dbd4-237d-45d2-8301-eeaff1f79a42', '2026-07-11T17:04:02.034Z', 'El palo', NULL, 240000.0, 'Disponible', NULL, NULL)
on conflict (id) do update set created_at = excluded.created_at, title = excluded.title, address = excluded.address, price = excluded.price, status = excluded.status, details = excluded.details, owner_id = excluded.owner_id;


-- Actividades: 0 registros
-- crm_activities: sin registros para importar


-- Tareas: 1 registros
-- Aviso: Tareas 4ea4fa1a-1400-4815-a668-9354cbf101f1 tenia client_id=460fb15f-b9f0-473e-aa15-c2c34de72874, pero no existe en Clientes. Se importa como NULL.
insert into crm_tasks (id, created_at, title, due_date, priority, client_id, property_id, notes, done, owner_id)
values
  ('4ea4fa1a-1400-4815-a668-9354cbf101f1', '2026-07-10T17:21:43.685Z', 'Hablar con Juan', '2026-07-11', 'Normal', NULL, 'a47a8b77-6377-4a48-8dd0-20c179696698', 'Prueba', false, NULL)
on conflict (id) do update set created_at = excluded.created_at, title = excluded.title, due_date = excluded.due_date, priority = excluded.priority, client_id = excluded.client_id, property_id = excluded.property_id, notes = excluded.notes, done = excluded.done, owner_id = excluded.owner_id;

commit;
