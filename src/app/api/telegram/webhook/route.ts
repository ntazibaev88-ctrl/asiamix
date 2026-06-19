import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://codeorda.vercel.app';

async function tg(method: string, body: object) {
  return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN) return NextResponse.json({ ok: false });

  try {
    const update = await req.json();

    // /start pay_USERID_COURSEID_AMOUNT
    if (update.message?.text?.startsWith('/start pay_')) {
      const payload = update.message.text.replace('/start pay_', '');
      const parts = payload.split('_');
      if (parts.length < 3) return NextResponse.json({ ok: true });

      const [userId, courseId, amount] = parts;
      const userChatId = update.message.chat.id;
      const firstName = update.message.from?.first_name || 'Пайдаланушы';

      const supabase = await createClient();
      const { data: course } = await supabase
        .from('courses').select('title, slug').eq('id', courseId).single();

      // Save pending payment
      await supabase.from('payments').upsert(
        {
          user_id: userId,
          course_id: courseId,
          amount: parseInt(amount),
          note: `Telegram: ${firstName} | chat_id: ${userChatId}`,
          status: 'pending',
        },
        { onConflict: 'user_id,course_id' }
      );

      // Confirm to user
      await tg('sendMessage', {
        chat_id: userChatId,
        text:
          `✅ <b>Өтінімді қабылдадық!</b>\n\n` +
          `📚 Курс: <b>${course?.title}</b>\n` +
          `💵 Сома: <b>${parseInt(amount).toLocaleString()} ₸</b>\n\n` +
          `⏳ Администратор тексергеннен кейін курс ашылады.\n` +
          `Күту уақыты: <b>5-30 минут</b>`,
        parse_mode: 'HTML',
      });

      // Notify admin
      await tg('sendMessage', {
        chat_id: ADMIN_CHAT_ID,
        text:
          `💰 <b>Жаңа төлем өтінімі!</b>\n\n` +
          `👤 ${firstName}\n` +
          `📚 ${course?.title}\n` +
          `💵 ${parseInt(amount).toLocaleString()} ₸\n` +
          `🆔 user_id: <code>${userId}</code>`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Растау', callback_data: `approve_${userId}_${courseId}_${userChatId}` },
            { text: '❌ Бас тарту', callback_data: `reject_${userId}_${courseId}_${userChatId}` },
          ]],
        },
      });
    }

    // Admin clicks approve/reject
    if (update.callback_query) {
      const data: string = update.callback_query.data;
      const msgChatId = update.callback_query.message?.chat?.id;
      const msgId = update.callback_query.message?.message_id;

      await tg('answerCallbackQuery', { callback_query_id: update.callback_query.id });

      const parts = data.split('_');
      const action = parts[0];
      const userId = parts[1];
      const courseId = parts[2];
      const userChatId = parts[3];

      const supabase = await createClient();
      const { data: course } = await supabase
        .from('courses').select('title, slug').eq('id', courseId).single();

      if (action === 'approve') {
        await supabase.from('enrollments').upsert(
          { user_id: userId, course_id: courseId },
          { onConflict: 'user_id,course_id' }
        );
        await supabase.from('payments')
          .update({ status: 'approved' })
          .eq('user_id', userId).eq('course_id', courseId).eq('status', 'pending');

        await tg('sendMessage', {
          chat_id: userChatId,
          text:
            `🎉 <b>Курс ашылды!</b>\n\n` +
            `📚 <b>${course?.title}</b> — дайын!\n\n` +
            `👇 Оқуды бастаңыз:\n` +
            `${SITE_URL}/courses/${course?.slug}`,
          parse_mode: 'HTML',
        });

        await tg('editMessageText', {
          chat_id: msgChatId,
          message_id: msgId,
          text: `✅ <b>Расталды</b> — ${course?.title}\n🆔 ${userId}`,
          parse_mode: 'HTML',
        });
      }

      if (action === 'reject') {
        await supabase.from('payments')
          .update({ status: 'rejected' })
          .eq('user_id', userId).eq('course_id', courseId).eq('status', 'pending');

        await tg('sendMessage', {
          chat_id: userChatId,
          text:
            `❌ <b>Төлем расталмады.</b>\n\n` +
            `Сұрақ болса: @codeorda_support`,
          parse_mode: 'HTML',
        });

        await tg('editMessageText', {
          chat_id: msgChatId,
          message_id: msgId,
          text: `❌ <b>Бас тартылды</b>\n🆔 ${userId}`,
          parse_mode: 'HTML',
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Telegram webhook error:', e);
    return NextResponse.json({ ok: true });
  }
}
