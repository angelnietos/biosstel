/**
 * API Routes para autenticación
 * Equivale a los controladores de NestJS
 * Ubicación: /api/auth/[...slug]
 */

import { NextRequest, NextResponse } from 'next/server'
import { login as loginService, register as registerService } from '../../data-access/authApi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    const { credentials, data } = body

    switch (action) {
      case 'login':
        const loginResult = await loginService(credentials)
        return NextResponse.json(loginResult)
      
      case 'register':
        const registerResult = await registerService(data)
        return NextResponse.json(registerResult)
      
      default:
        return NextResponse.json(
          { message: 'Acción no válida' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Verificar si el usuario está autenticado
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }

  return NextResponse.json({ authenticated: true })
}
