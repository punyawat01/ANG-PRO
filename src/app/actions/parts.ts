'use server'

import { prisma } from '@/lib/prisma'

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: categories };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: 'Failed to fetch categories' };
    }
}

export async function searchParts({
    brandName,
    modelName,
    year,
    categoryId,
    searchTerm,
    width,
    length,
    height,
    innerDiameter,
    outerDiameter
}: {
    brandName?: string;
    modelName?: string;
    year?: string;
    categoryId?: number;
    searchTerm?: string;
    width?: number;
    length?: number;
    height?: number;
    innerDiameter?: number;
    outerDiameter?: number;
}) {
    try {
        const vehicleFilter: any = {};
        if (year) vehicleFilter.year = year;
        if (modelName || brandName) {
            vehicleFilter.model = {};
            if (modelName) vehicleFilter.model.name = modelName;
            if (brandName) vehicleFilter.model.brand = { name: brandName };
        }

        const parts = await prisma.part.findMany({
            where: {
                AND: [
                    // Filter by keyword if provided
                    searchTerm ? {
                        OR: [
                            { partNumber: { contains: searchTerm } },
                            { name: { contains: searchTerm } },
                            { description: { contains: searchTerm } },
                            {
                                alternativeNumbers: {
                                    some: { number: { contains: searchTerm } }
                                }
                            }
                        ]
                    } : {},
                    // Filter by category if provided
                    categoryId ? { categoryId } : {},
                    // Filter by vehicle attributes if any are provided
                    (brandName || modelName || year) ? {
                        compatibilities: {
                            some: {
                                vehicle: vehicleFilter
                            }
                        }
                    } : {},
                    // Filter by Dimensions if provided
                    width ? { width } : {},
                    length ? { length } : {},
                    height ? { height } : {},
                    innerDiameter ? { innerDiameter } : {},
                    outerDiameter ? { outerDiameter } : {}
                ]
            },
            include: {
                category: true,
                alternativeNumbers: true,
                // Include minimal compatibility data if needed
            },
            orderBy: { name: 'asc' }
        });

        return { success: true, data: parts };
    } catch (error) {
        console.error('Error searching parts:', error);
        return { success: false, error: 'Failed to search parts' };
    }
}
