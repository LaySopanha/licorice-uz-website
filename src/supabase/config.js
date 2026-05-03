import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadProductImage(slug, file) {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const path = `${slug}/${fileName}`;

    const { error } = await supabase.storage
        .from('products')
        .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
        .from('products')
        .getPublicUrl(path);

    return data.publicUrl;
}

export async function uploadGalleryImage(file) {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const path = `image-${fileName}`;

    const { error } = await supabase.storage
        .from('gallery')
        .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
        .from('gallery')
        .getPublicUrl(path);

    return data.publicUrl;
}
