'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getBrands(categoryId?: number) {
    try {
        const whereClause = categoryId ? {
            models: { some: { vehicles: { some: { compatibilities: { some: { part: { categoryId } } } } } } }
        } : {};

        const brands = await prisma.brand.findMany({
            where: whereClause,
            orderBy: { name: 'asc' }
        });
        return { success: true, data: brands };
    } catch (error) {
        console.error('Error fetching brands:', error);
        return { success: false, error: 'Failed to fetch brands' };
    }
}

export async function getModelsByBrand(brandId: number, categoryId?: number) {
    try {
        const models = await prisma.model.findMany({
            where: {
                brandId,
                ...(categoryId ? { vehicles: { some: { compatibilities: { some: { part: { categoryId } } } } } } : {})
            },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: models };
    } catch (error) {
        console.error('Error fetching models:', error);
        return { success: false, error: 'Failed to fetch models' };
    }
}

export async function getYearsByModel(modelId: number, categoryId?: number) {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where: {
                modelId,
                ...(categoryId ? { compatibilities: { some: { part: { categoryId } } } } : {})
            },
            orderBy: { year: 'desc' }
        });
        // Return unique years or the vehicle objects directly
        return { success: true, data: vehicles };
    } catch (error) {
        console.error('Error fetching years:', error);
        return { success: false, error: 'Failed to fetch vehicle years' };
    }
}

// ADMIN ACTIONS FOR BRANDS & MODELS

export async function saveBrand(id: number | null, name: string) {
    try {
        if (!name.trim()) return { success: false, error: 'Name is required' };

        let result;
        if (id) {
            result = await prisma.brand.update({ where: { id }, data: { name } });
        } else {
            result = await prisma.brand.create({ data: { name } });
        }
        revalidatePath('/admin/vehicles');
        return { success: true, data: result };
    } catch (e: any) {
        if (e.code === 'P2002') return { success: false, error: 'ยุห้อนี้มีอยู่แล้ว' };
        return { success: false, error: 'Failed to save brand' };
    }
}

export async function deleteBrand(id: number) {
    try {
        await prisma.brand.delete({ where: { id } });
        revalidatePath('/admin/vehicles');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to delete brand (may be in use)' };
    }
}

export async function saveModel(id: number | null, brandId: number, name: string) {
    try {
        if (!name.trim()) return { success: false, error: 'Name is required' };

        let result;
        if (id) {
            result = await prisma.model.update({ where: { id }, data: { name, brandId } });
        } else {
            result = await prisma.model.create({ data: { name, brandId } });
        }
        revalidatePath('/admin/vehicles');
        return { success: true, data: result };
    } catch (e: any) {
        if (e.code === 'P2002') return { success: false, error: 'รุ่นนี้มีอยู่แล้วในยี่ห้อนี้' };
        return { success: false, error: 'Failed to save model' };
    }
}

export async function deleteModel(id: number) {
    try {
        await prisma.model.delete({ where: { id } });
        revalidatePath('/admin/vehicles');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to delete model (may be in use)' };
    }
}
