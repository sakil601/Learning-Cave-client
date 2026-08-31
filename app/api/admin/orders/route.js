import {NextResponse} from 'next/server'; import {requireAdmin} from '@/lib/auth'; import {connectDB} from '@/lib/db'; import Order from '@/models/Order';
export async function GET(){if(!await requireAdmin())return NextResponse.json({message:'Unauthorized'},{status:401});await connectDB();return NextResponse.json({orders:await Order.find().sort({createdAt:-1}).lean()})}
