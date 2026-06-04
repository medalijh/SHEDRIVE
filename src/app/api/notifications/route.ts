import { NextRequest, NextResponse } from "next/server";

// Mock notifications store
const notifications: Map<string, any[]> = new Map();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    if (!userId) {
      return NextResponse.json({ error: "userId requis" }, { status: 400 });
    }

    let userNotifications = notifications.get(userId) || [];

    if (unreadOnly) {
      userNotifications = userNotifications.filter(n => !n.read);
    }

    return NextResponse.json({
      data: userNotifications,
      count: userNotifications.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, type, title, message, data } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const notification = {
      id: `NOTIF-${Date.now()}`,
      type, // 'driver_accepted', 'driver_arrived', 'ride_completed', etc.
      title,
      message,
      data: data || {},
      read: false,
      createdAt: new Date().toISOString(),
    };

    if (!notifications.has(userId)) {
      notifications.set(userId, []);
    }

    const userNotifications = notifications.get(userId)!;
    userNotifications.unshift(notification);

    // Keep only last 50 notifications
    if (userNotifications.length > 50) {
      userNotifications.pop();
    }

    return NextResponse.json({ data: notification }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, notificationId, read } = body;

    if (!userId || !notificationId) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const userNotifications = notifications.get(userId);
    if (!userNotifications) {
      return NextResponse.json({ error: "Notifications non trouvées" }, { status: 404 });
    }

    const notification = userNotifications.find(n => n.id === notificationId);
    if (!notification) {
      return NextResponse.json({ error: "Notification non trouvée" }, { status: 404 });
    }

    notification.read = read !== undefined ? read : !notification.read;

    return NextResponse.json({ data: notification });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
