import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding initial charities into the database...");
  
  const charities = [
    { 
      name: 'First Tee Foundation', 
      description: 'Impacting the lives of young people by providing educational programs that build character, instill life-enhancing values and promote healthy choices through the game of golf.' 
    },
    { 
      name: 'The Ocean Cleanup', 
      description: 'Developing and scaling advanced technologies to rid the world\'s oceans of plastic. Our aim is to put ourselves out of business once the oceans are clean.' 
    },
    { 
      name: 'Doctors Without Borders', 
      description: 'Medical professionals providing life-saving medical care where it is needed most, in over 70 countries around the world.' 
    }
  ];

  const { data, error } = await supabase.from('charities').insert(charities);

  if (error) {
    console.error("Error inserting charities:", error);
  } else {
    console.log("Successfully added 3 verified charities to the database!");
  }
}

seed();
