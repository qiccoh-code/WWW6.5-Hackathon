import { NextRequest, NextResponse } from "next/server";

interface AnalyzeReviewRequest {
  comment: string;
  rating: number;
}

interface AnalyzeReviewResponse {
  tags: string[];
  scores: Record<string, number>;
  sentiment: "positive" | "neutral" | "negative";
}

/**
 * AI分析评论内容
 * 这里使用简单的关键词和规则分析
 * 可以集成 OpenAI API、Anthropic Claude 或其他 AI 服务
 */
function analyzeCommentWithRules(
  comment: string,
  rating: number
): AnalyzeReviewResponse {
  const lowerComment = comment.toLowerCase();

  // 定义关键词库
  const keywordTags: Record<string, string[]> = {
    "技术卓越": [
      "卓越",
      "精深",
      "技术强",
      "代码质量",
      "架构",
      "算法",
      "优化",
      "高效",
    ],
    "耐心教学": [
      "耐心",
      "细致",
      "讲解清楚",
      "易理解",
      "循循善诱",
      "讲得好",
    ],
    "反应迅速": [
      "快速",
      "及时",
      "秒回",
      "响应快",
      "高效",
      "迅速",
      "立即",
    ],
    "业界经验": [
      "经验丰富",
      "见识广",
      "实战",
      "项目经验",
      "行业",
      "深度",
    ],
    "亲切和善": [
      "和善",
      "友好",
      "热心",
      "亲切",
      "热情",
      "认真",
      "专业",
    ],
    "沟通困难": [
      "难理解",
      "表达不清",
      "沟通差",
      "听不懂",
      "模糊",
    ],
    "不够耐心": [
      "不耐烦",
      "生硬",
      "冷淡",
      "敷衍",
      "急躁",
    ],
    "响应缓慢": [
      "回复慢",
      "没回应",
      "冷漠",
      "懒散",
      "不及时",
    ],
  };

  // 提取标签
  const tags: string[] = [];
  Object.entries(keywordTags).forEach(([tag, keywords]) => {
    const found = keywords.some((kw) => lowerComment.includes(kw));
    if (found) {
      tags.push(tag);
    }
  });

  // 如果没有匹配到标签，根据评分和内容长度生成基础标签
  if (tags.length === 0) {
    if (rating >= 4) {
      tags.push("推荐");
    } else if (rating <= 2) {
      tags.push("需改进");
    } else {
      tags.push("一般");
    }
  }

  // 计算各维度评分（0-5 scale，转换为百分比用 0-1）
  const scores: Record<string, number> = {
    communication: 0.5,
    technical: 0.5,
    responsiveness: 0.5,
    overall: Math.min(1, rating / 5),
  };

  // 根据关键词调整评分
  if (
    tags.includes("技术卓越") ||
    lowerComment.includes("技术") ||
    lowerComment.includes("代码")
  ) {
    scores.technical = Math.min(1, rating / 5 + 0.1);
  }

  if (
    tags.includes("耐心教学") ||
    lowerComment.includes("讲解") ||
    lowerComment.includes("教")
  ) {
    scores.communication = Math.min(1, rating / 5 + 0.1);
  }

  if (
    tags.includes("反应迅速") ||
    lowerComment.includes("快") ||
    lowerComment.includes("及时")
  ) {
    scores.responsiveness = Math.min(1, rating / 5 + 0.1);
  }

  if (
    tags.includes("沟通困难") ||
    lowerComment.includes("难理解") ||
    tags.includes("响应缓慢")
  ) {
    scores.communication = Math.max(0, rating / 5 - 0.1);
    scores.responsiveness = Math.max(0, rating / 5 - 0.1);
  }

  // 情感分析
  const positiveWords = [
    "好",
    "很",
    "真",
    "棒",
    "不错",
    "推荐",
    "优秀",
    "优",
    "赞",
  ];
  const negativeWords = [
    "差",
    "不好",
    "糟",
    "差劲",
    "失望",
    "后悔",
    "不满",
    "问题",
  ];

  const positiveCount = positiveWords.filter((w) =>
    lowerComment.includes(w)
  ).length;
  const negativeCount = negativeWords.filter((w) =>
    lowerComment.includes(w)
  ).length;

  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  if (positiveCount > negativeCount) {
    sentiment = "positive";
  } else if (negativeCount > positiveCount) {
    sentiment = "negative";
  } else if (rating >= 4) {
    sentiment = "positive";
  } else if (rating <= 2) {
    sentiment = "negative";
  }

  return {
    tags: Array.from(new Set(tags)).slice(0, 5), // 最多5个标签，去重
    scores,
    sentiment,
  };
}

/**
 * 可选：集成真实 AI API（OpenAI/Claude）
 * 这里保留了函数签名供未来扩展
 */
async function analyzeCommentWithAI(
  comment: string,
  rating: number
): Promise<AnalyzeReviewResponse> {
  // TODO: 集成 OpenAI API
  // const response = await fetch("https://api.openai.com/v1/chat/completions", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       {
  //         role: "system",
  //         content: "You are an expert at analyzing mentor reviews...",
  //       },
  //       {
  //         role: "user",
  //         content: `分析以下评价：\n${comment}\n\n评分：${rating}/5`,
  //       },
  //     ],
  //   }),
  // });
  // ...
  throw new Error("AI API not configured");
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeReviewRequest = await request.json();

    if (!body.comment || typeof body.comment !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'comment' field" },
        { status: 400 }
      );
    }

    if (!body.rating || typeof body.rating !== "number") {
      return NextResponse.json(
        { error: "Missing or invalid 'rating' field" },
        { status: 400 }
      );
    }

    // 使用规则引擎分析（生产环境建议集成真实 AI API）
    const result = analyzeCommentWithRules(body.comment, body.rating);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error analyzing review:", error);
    return NextResponse.json(
      { error: "Failed to analyze review" },
      { status: 500 }
    );
  }
}
