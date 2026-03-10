import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('Seeding data...')

    // 1. Categories
    const catEngine = await prisma.category.upsert({
        where: { name: 'เครื่องยนต์' },
        update: {},
        create: { name: 'เครื่องยนต์' },
    })

    const catBrake = await prisma.category.upsert({
        where: { name: 'ระบบเบรก' },
        update: {},
        create: { name: 'ระบบเบรก' },
    })

    // 2. Brands & Models Data
    const carData = [
        { brand: 'Toyota', models: ['Hilux Revo', 'Hilux Vigo', 'Fortuner', 'Camry', 'Corolla Altis', 'Yaris', 'Vios', 'Commuter', 'Avanza', 'Innova'] },
        { brand: 'Honda', models: ['Civic', 'Accord', 'City', 'Jazz', 'CR-V', 'HR-V', 'BR-V', 'Brio', 'Mobilio'] },
        { brand: 'Isuzu', models: ['D-Max', 'MU-X', 'MU-7', 'Dragon Eye'] },
        { brand: 'Mitsubishi', models: ['Triton', 'Pajero Sport', 'Mirage', 'Attrage', 'Lancer EX', 'Xpander', 'Space Wagon'] },
        { brand: 'Nissan', models: ['Navara', 'Almera', 'March', 'Teana', 'Terra', 'Sylphy', 'Kicks', 'X-Trail', 'Juke'] },
        { brand: 'Mazda', models: ['Mazda2', 'Mazda3', 'CX-3', 'CX-5', 'CX-8', 'BT-50 Pro', 'BT-50'] },
        { brand: 'Ford', models: ['Ranger', 'Everest', 'Fiesta', 'Focus', 'EcoSport', 'Escape'] },
        { brand: 'Suzuki', models: ['Swift', 'Celerio', 'Ertiga', 'Ciaz', 'XL7', 'Carry'] },
        { brand: 'MG', models: ['ZS', 'HS', 'EP', 'MG3', 'MG4', 'MG5', 'Extender'] },
        { brand: 'Chevrolet', models: ['Colorado', 'Trailblazer', 'Captiva', 'Cruze', 'Sonic', 'Optra'] },
        { brand: 'Hyundai', models: ['H-1', 'Staria', 'Tucson', 'Elantra'] },
        { brand: 'Kia', models: ['Carnival', 'Sorento', 'Sportage'] },
        { brand: 'BMW', models: ['Series 3', 'Series 5', 'Series 7', 'X1', 'X3', 'X5'] },
        { brand: 'Mercedes-Benz', models: ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE'] }
    ];

    console.log('Seeding Brands and Models...');

    // Store Toyota and Honda references for later use in seed script
    let toyotaId = 0;
    let hondaId = 0;
    let hiluxId = 0;
    let civicId = 0;

    for (const { brand, models } of carData) {
        const brandRecord = await prisma.brand.upsert({
            where: { name: brand },
            update: {},
            create: { name: brand },
        });

        if (brand === 'Toyota') toyotaId = brandRecord.id;
        if (brand === 'Honda') hondaId = brandRecord.id;

        for (const model of models) {
            const modelRecord = await prisma.model.upsert({
                where: { brandId_name: { brandId: brandRecord.id, name: model } },
                update: {},
                create: { name: model, brandId: brandRecord.id },
            });

            if (brand === 'Toyota' && model === 'Hilux Revo') hiluxId = modelRecord.id;
            if (brand === 'Honda' && model === 'Civic') civicId = modelRecord.id;
        }
    }

    // 4. Vehicles
    const rev2020 = await prisma.vehicle.upsert({
        where: { modelId_year: { modelId: hiluxId, year: "2020" } },
        update: {},
        create: { modelId: hiluxId, year: "2020" },
    })

    const civic2019 = await prisma.vehicle.upsert({
        where: { modelId_year: { modelId: civicId, year: "2019" } },
        update: {},
        create: { modelId: civicId, year: "2019" },
    })

    // 5. Parts
    const part1 = await prisma.part.upsert({
        where: { partNumber: 'TY-HLX-FIL-001' },
        update: {},
        create: {
            partNumber: 'TY-HLX-FIL-001',
            name: 'กรองน้ำมันเครื่อง Toyota แท้',
            description: 'กรองน้ำมันเครื่องสำหรับเครื่องยนต์ดีเซล 2.4/2.8',
            price: 250.00,
            categoryId: catEngine.id,
        },
    })

    const part2 = await prisma.part.upsert({
        where: { partNumber: 'HD-CVC-BRK-001' },
        update: {},
        create: {
            partNumber: 'HD-CVC-BRK-001',
            name: 'ผ้าเบรกหน้า Honda Civic Gen 10',
            description: 'ผ้าเบรกหน้าเกรดพรีเมียม ลดฝุ่น',
            price: 1500.00,
            categoryId: catBrake.id,
        },
    })

    // 6. Compatibility
    await prisma.compatibility.upsert({
        where: { partId_vehicleId: { partId: part1.id, vehicleId: rev2020.id } },
        update: {},
        create: {
            partId: part1.id,
            vehicleId: rev2020.id,
            notes: 'สำหรับเครื่อง 2.4/2.8 เท่านั้น',
        },
    })

    await prisma.compatibility.upsert({
        where: { partId_vehicleId: { partId: part2.id, vehicleId: civic2019.id } },
        update: {},
        create: {
            partId: part2.id,
            vehicleId: civic2019.id,
            notes: 'ไม่รองรับเครื่องยนต์ e:HEV',
        },
    })

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
