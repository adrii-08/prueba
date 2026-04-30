const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // ── Sedes ──────────────────────────────────────────────────────────────
  const sede1 = await prisma.sede.create({
    data: {
      nombre: 'Centro de Convenciones Metropolitano',
      direccion: 'Av. Principal 1234, Ciudad Central',
      capacidad: 500,
    },
  });

  const sede2 = await prisma.sede.create({
    data: {
      nombre: 'Hotel Grand Plaza - Salón Imperial',
      direccion: 'Calle Comercial 567, Zona Norte',
      capacidad: 200,
    },
  });

  const sede3 = await prisma.sede.create({
    data: {
      nombre: 'Auditorio Universidad Nacional',
      direccion: 'Campus Universitario, Edificio B',
      capacidad: 150,
    },
  });

  console.log('✅ Sedes creadas:', [sede1.nombre, sede2.nombre, sede3.nombre]);

  // ── Asistentes ─────────────────────────────────────────────────────────
  const asistente1 = await prisma.asistente.create({
    data: {
      nombre: 'Carlos',
      apellido: 'Ramírez',
      email: 'carlos.ramirez@email.com',
      telefono: '+54 11 5555-0001',
    },
  });

  const asistente2 = await prisma.asistente.create({
    data: {
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@email.com',
      telefono: '+54 11 5555-0002',
    },
  });

  const asistente3 = await prisma.asistente.create({
    data: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@email.com',
      telefono: '+54 11 5555-0003',
    },
  });

  const asistente4 = await prisma.asistente.create({
    data: {
      nombre: 'Ana',
      apellido: 'López',
      email: 'ana.lopez@email.com',
      telefono: '+54 11 5555-0004',
    },
  });

  console.log('✅ Asistentes creados:', [
    `${asistente1.nombre} ${asistente1.apellido}`,
    `${asistente2.nombre} ${asistente2.apellido}`,
    `${asistente3.nombre} ${asistente3.apellido}`,
    `${asistente4.nombre} ${asistente4.apellido}`,
  ]);

  // ── Patrocinadores ────────────────────────────────────────────────────
  const patrocinador1 = await prisma.patrocinador.create({
    data: {
      nombre: 'TechCorp Solutions',
      email: 'sponsors@techcorp.com',
      telefono: '+54 11 4444-1000',
    },
  });

  const patrocinador2 = await prisma.patrocinador.create({
    data: {
      nombre: 'InnovaDigital',
      email: 'contacto@innovadigital.com',
      telefono: '+54 11 4444-2000',
    },
  });

  const patrocinador3 = await prisma.patrocinador.create({
    data: {
      nombre: 'DataStream Inc.',
      email: 'partners@datastream.io',
      telefono: '+54 11 4444-3000',
    },
  });

  console.log('✅ Patrocinadores creados:', [
    patrocinador1.nombre,
    patrocinador2.nombre,
    patrocinador3.nombre,
  ]);

  // ── Eventos ───────────────────────────────────────────────────────────
  const evento1 = await prisma.evento.create({
    data: {
      nombre: 'Conferencia de Tecnología 2026',
      descripcion: 'Evento anual de tecnología con ponencias sobre IA, Cloud Computing y Desarrollo Web.',
      fechaInicio: new Date('2026-06-15T09:00:00'),
      fechaFin: new Date('2026-06-17T18:00:00'),
      sedeId: sede1.id,
    },
  });

  const evento2 = await prisma.evento.create({
    data: {
      nombre: 'Workshop de Prisma y Node.js',
      descripcion: 'Taller práctico de desarrollo backend con Prisma ORM y Node.js.',
      fechaInicio: new Date('2026-07-10T10:00:00'),
      fechaFin: new Date('2026-07-10T17:00:00'),
      sedeId: sede3.id,
    },
  });

  const evento3 = await prisma.evento.create({
    data: {
      nombre: 'Networking Night',
      descripcion: 'Evento de networking para profesionales del sector tecnológico.',
      fechaInicio: new Date('2026-08-20T19:00:00'),
      fechaFin: new Date('2026-08-20T23:00:00'),
      sedeId: sede2.id,
    },
  });

  console.log('✅ Eventos creados:', [evento1.nombre, evento2.nombre, evento3.nombre]);

  // ── Registrar asistentes en eventos ───────────────────────────────────
  await prisma.eventoAsistente.createMany({
    data: [
      { eventoId: evento1.id, asistenteId: asistente1.id },
      { eventoId: evento1.id, asistenteId: asistente2.id },
      { eventoId: evento1.id, asistenteId: asistente3.id },
      { eventoId: evento2.id, asistenteId: asistente1.id },
      { eventoId: evento2.id, asistenteId: asistente4.id },
      { eventoId: evento3.id, asistenteId: asistente2.id },
      { eventoId: evento3.id, asistenteId: asistente3.id },
      { eventoId: evento3.id, asistenteId: asistente4.id },
    ],
  });

  console.log('✅ Asistentes registrados en eventos');

  // ── Asignar patrocinadores a eventos con monto ────────────────────────
  await prisma.eventoPatrocinador.createMany({
    data: [
      { eventoId: evento1.id, patrocinadorId: patrocinador1.id, montoPatrocinio: 50000.00 },
      { eventoId: evento1.id, patrocinadorId: patrocinador2.id, montoPatrocinio: 30000.00 },
      { eventoId: evento2.id, patrocinadorId: patrocinador3.id, montoPatrocinio: 15000.00 },
      { eventoId: evento3.id, patrocinadorId: patrocinador1.id, montoPatrocinio: 20000.00 },
      { eventoId: evento3.id, patrocinadorId: patrocinador3.id, montoPatrocinio: 10000.00 },
    ],
  });

  console.log('✅ Patrocinadores asignados a eventos');

  console.log('\n🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
