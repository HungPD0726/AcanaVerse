import type { CardSeed } from "@/data/card-seeds";
import type { Suit } from "@/domain/tarot";

type MinorContent = {
  nameVi: string;
  nameEn: string;
  upright: CardSeed["upright"];
  reversed: CardSeed["reversed"];
};

const rankMeta = [
  ["ace", "Ace"],
  ["two", "Two"],
  ["three", "Three"],
  ["four", "Four"],
  ["five", "Five"],
  ["six", "Six"],
  ["seven", "Seven"],
  ["eight", "Eight"],
  ["nine", "Nine"],
  ["ten", "Ten"],
  ["page", "Page"],
  ["knight", "Knight"],
  ["queen", "Queen"],
  ["king", "King"],
] as const;

function buildSuit(suit: Suit, content: MinorContent[]): CardSeed[] {
  return content.map((item, index) => {
    const number = index + 1;
    const [rankSlug, rank] = rankMeta[index];
    return {
      asset: `${suit}-${String(number).padStart(2, "0")}`,
      slug: `${rankSlug}-of-${suit}`,
      code: `${suit.toUpperCase()}_${String(number).padStart(2, "0")}`,
      arcana: "minor",
      suit,
      rank,
      number,
      ...item,
    };
  });
}

const wands = buildSuit("wands", [
  {
    nameVi: "Át Gậy",
    nameEn: "Ace of Wands",
    upright: ["cảm hứng, khởi động", "inspiration, initiative", "Một tia cảm hứng có sức sống đang xuất hiện; hãy cho nó một hành động đầu tiên cụ thể.", "A lively spark is appearing; give it one concrete first action."],
    reversed: ["chậm khởi động, cạn lửa", "delay, low energy", "Ý tưởng có tiềm năng nhưng năng lượng chưa hội tụ; hãy giảm phạm vi và bắt đầu nhỏ hơn.", "The idea has potential but energy is scattered; narrow the scope and begin smaller."],
  },
  {
    nameVi: "Hai Gậy",
    nameEn: "Two of Wands",
    upright: ["lập kế hoạch, tầm nhìn", "planning, foresight", "Bạn đã nhìn thấy một chân trời rộng hơn; giờ cần chọn hướng và chuẩn bị bước ra khỏi vùng quen thuộc.", "You can see a wider horizon; choose a direction and prepare to leave the familiar."],
    reversed: ["sợ thay đổi, kế hoạch hẹp", "fear of change, limited planning", "Sự an toàn đang giữ kế hoạch quá nhỏ; hãy gọi tên rủi ro thật thay vì sợ mọi khả năng.", "Safety is keeping the plan too small; name the real risk instead of fearing every possibility."],
  },
  {
    nameVi: "Ba Gậy",
    nameEn: "Three of Wands",
    upright: ["mở rộng, tiến triển", "expansion, progress", "Công việc ban đầu đang tạo đà; hãy nhìn xa hơn và chuẩn bị đón kết quả từ những gì đã gửi đi.", "Early work is creating momentum; look farther and prepare for what your efforts bring back."],
    reversed: ["chậm trễ, thiếu tầm nhìn", "delay, poor foresight", "Sự tiến triển bị chậm vì kế hoạch chưa tính đủ khoảng cách hoặc nguồn lực.", "Progress is slowed because the plan did not fully account for distance or resources."],
  },
  {
    nameVi: "Bốn Gậy",
    nameEn: "Four of Wands",
    upright: ["ổn định, sum họp", "stability, celebration", "Một cột mốc xứng đáng được ghi nhận; sự ổn định hiện tại đến từ cộng đồng và nền móng chung.", "A milestone deserves recognition; current stability comes from community and shared foundations."],
    reversed: ["căng thẳng trong nhà, nền móng lỏng", "home tension, unstable foundation", "Không gian lẽ ra đem lại an toàn đang thiếu đồng thuận; hãy sửa lại nền móng trước khi ăn mừng.", "A space meant to feel safe lacks agreement; repair the foundation before celebrating."],
  },
  {
    nameVi: "Năm Gậy",
    nameEn: "Five of Wands",
    upright: ["cạnh tranh, va chạm", "competition, friction", "Nhiều ý chí đang va vào nhau; xung đột có thể hữu ích nếu mọi người thống nhất luật chơi.", "Several wills are colliding; conflict can be useful when everyone agrees on the rules."],
    reversed: ["né xung đột, căng thẳng âm ỉ", "conflict avoidance, hidden tension", "Sự yên lặng không có nghĩa là bất đồng đã hết; cần một cuộc trao đổi có cấu trúc.", "Silence does not mean disagreement is gone; a structured conversation is needed."],
  },
  {
    nameVi: "Sáu Gậy",
    nameEn: "Six of Wands",
    upright: ["được công nhận, chiến thắng", "recognition, victory", "Nỗ lực đang được nhìn nhận; hãy nhận thành quả với sự tự tin và nhớ đến những người đã hỗ trợ.", "Your effort is being recognized; receive success confidently and remember those who helped."],
    reversed: ["thiếu công nhận, cái tôi tổn thương", "unrecognized work, wounded pride", "Giá trị của công việc không chỉ nằm ở phản hồi bên ngoài; hãy kiểm tra tiêu chuẩn bạn đang dùng.", "The value of the work is not limited to outside praise; examine the standard you are using."],
  },
  {
    nameVi: "Bảy Gậy",
    nameEn: "Seven of Wands",
    upright: ["giữ vững, bảo vệ lập trường", "defense, conviction", "Bạn đang ở vị trí cần bảo vệ điều đã xây được; hãy chọn ranh giới quan trọng nhất.", "You need to protect what you have built; choose the boundary that matters most."],
    reversed: ["quá tải, bỏ cuộc", "overwhelm, giving up", "Việc chống đỡ mọi phía đang làm bạn cạn sức; không phải trận nào cũng cần tham gia.", "Defending every front is exhausting you; not every battle requires your participation."],
  },
  {
    nameVi: "Tám Gậy",
    nameEn: "Eight of Wands",
    upright: ["nhanh chóng, chuyển động", "speed, movement", "Tin tức hoặc hành động đang tăng tốc; giữ thông tin rõ ràng để động lực không biến thành hỗn loạn.", "News or action is accelerating; keep communication clear so momentum does not become chaos."],
    reversed: ["trì hoãn, thông tin rối", "delay, mixed messages", "Nhiều tín hiệu chồng chéo đang làm chậm tiến độ; hãy dừng và sắp lại thứ tự.", "Overlapping signals are slowing progress; pause and restore the sequence."],
  },
  {
    nameVi: "Chín Gậy",
    nameEn: "Nine of Wands",
    upright: ["bền bỉ, cảnh giác", "resilience, vigilance", "Bạn đã đi qua nhiều thử thách và vẫn còn sức cho chặng cuối; hãy bảo vệ năng lượng còn lại.", "You have endured much and still have strength for the final stretch; protect what remains."],
    reversed: ["kiệt sức, phòng thủ quá mức", "exhaustion, hypervigilance", "Sự cảnh giác liên tục đang tiêu hao bạn; nghỉ ngơi là một phần của khả năng bền bỉ.", "Constant vigilance is draining you; rest is part of resilience."],
  },
  {
    nameVi: "Mười Gậy",
    nameEn: "Ten of Wands",
    upright: ["gánh nặng, trách nhiệm", "burden, responsibility", "Bạn đang mang quá nhiều để hoàn tất một mục tiêu; hãy phân biệt trách nhiệm thật với việc tự ôm thêm.", "You are carrying too much to complete a goal; separate true responsibility from what you volunteered to hold."],
    reversed: ["buông gánh, quá tải", "release, overload", "Đã đến lúc đặt xuống, chia sẻ hoặc loại bỏ một phần gánh nặng không còn cần thiết.", "It is time to set down, share, or remove part of a burden that is no longer necessary."],
  },
  {
    nameVi: "Tiểu Đồng Gậy",
    nameEn: "Page of Wands",
    upright: ["khám phá, nhiệt tình", "exploration, enthusiasm", "Một thông điệp hoặc ý tưởng mới đang khơi dậy sự háo hức; hãy thử nghiệm mà không đòi hỏi hoàn hảo.", "A message or idea is awakening enthusiasm; experiment without demanding perfection."],
    reversed: ["thiếu định hướng, hứng thú chóng tàn", "poor direction, fleeting enthusiasm", "Năng lượng mới chưa có nơi để đi; hãy chọn một thử nghiệm nhỏ thay vì đổi ý liên tục.", "Fresh energy has nowhere to go; choose one small experiment instead of changing direction repeatedly."],
  },
  {
    nameVi: "Hiệp Sĩ Gậy",
    nameEn: "Knight of Wands",
    upright: ["hành động, phiêu lưu", "action, adventure", "Động lực mạnh đang thúc bạn tiến lên; giữ một điểm neo để nhiệt tình không vượt quá khả năng.", "Strong momentum urges you forward; keep one anchor so enthusiasm does not outrun capacity."],
    reversed: ["bốc đồng, nóng vội", "impulsiveness, haste", "Tốc độ đang thay thế cho định hướng; hãy dừng đủ lâu để hiểu hệ quả.", "Speed is replacing direction; pause long enough to understand the consequences."],
  },
  {
    nameVi: "Nữ Hoàng Gậy",
    nameEn: "Queen of Wands",
    upright: ["tự tin, cuốn hút", "confidence, warmth", "Sự hiện diện chân thành và tự tin của bạn có thể làm không gian sống động hơn.", "Your warm, authentic confidence can make the whole space more alive."],
    reversed: ["ghen tị, thiếu tự tin", "jealousy, insecurity", "So sánh đang làm lu mờ sức mạnh riêng; hãy trở lại với điều khiến bạn thật sự có sinh lực.", "Comparison is obscuring your own power; return to what genuinely gives you energy."],
  },
  {
    nameVi: "Vua Gậy",
    nameEn: "King of Wands",
    upright: ["tầm nhìn, lãnh đạo", "vision, leadership", "Một tầm nhìn lớn cần được dẫn dắt bằng sự nhất quán và khả năng truyền lửa cho người khác.", "A large vision needs consistent leadership and the ability to kindle others' commitment."],
    reversed: ["độc đoán, kỳ vọng phi thực tế", "domination, unrealistic expectations", "Tầm nhìn đang trở thành áp đặt; hãy lắng nghe giới hạn thực tế của con người và nguồn lực.", "Vision is turning into imposition; listen to the real limits of people and resources."],
  },
]);

const cups = buildSuit("cups", [
  {
    nameVi: "Át Cốc",
    nameEn: "Ace of Cups",
    upright: ["cảm xúc mới, rộng lòng", "new feelings, openness", "Một dòng cảm xúc mới đang mở ra; hãy đón nhận nó mà không vội định nghĩa.", "A new current of feeling is opening; receive it without rushing to define it."],
    reversed: ["cảm xúc bị chặn, cạn kiệt", "blocked emotion, depletion", "Điều cần được cảm nhận đang bị nén lại; hãy tạo một nơi an toàn để cảm xúc được đi qua.", "Something that needs to be felt is being held back; create a safe place for it to move."],
  },
  {
    nameVi: "Hai Cốc",
    nameEn: "Two of Cups",
    upright: ["kết nối, tương hỗ", "connection, reciprocity", "Một mối liên hệ được nuôi bằng sự tôn trọng và trao đổi cân bằng đang hình thành.", "A bond built on respect and balanced exchange is forming."],
    reversed: ["mất kết nối, thiếu cân bằng", "disconnection, imbalance", "Sự tương hỗ đang thiếu vắng; hãy làm rõ điều mỗi bên thực sự có thể trao.", "Reciprocity is missing; clarify what each side can genuinely offer."],
  },
  {
    nameVi: "Ba Cốc",
    nameEn: "Three of Cups",
    upright: ["bạn bè, chia vui", "friendship, shared joy", "Cộng đồng và niềm vui chung là nguồn nâng đỡ thật sự lúc này.", "Community and shared joy are a genuine source of support now."],
    reversed: ["quá đà, lạc lõng", "excess, exclusion", "Một nhóm hoặc cuộc vui đang làm bạn mất kết nối với nhu cầu thật; hãy chọn sự gần gũi có chất lượng.", "A group or celebration is disconnecting you from real needs; choose meaningful closeness."],
  },
  {
    nameVi: "Bốn Cốc",
    nameEn: "Four of Cups",
    upright: ["thờ ơ, suy ngẫm", "apathy, contemplation", "Sự chán nản có thể khiến bạn bỏ qua một lựa chọn đang hiện diện; hãy nhìn lại bằng đôi mắt mới.", "Discontent may be hiding an available choice; look again with fresh attention."],
    reversed: ["tỉnh lại, cơ hội mới", "renewed interest, new opportunity", "Bạn đang sẵn sàng trở lại với đời sống sau một giai đoạn thu mình.", "You are ready to re-engage with life after a period of withdrawal."],
  },
  {
    nameVi: "Năm Cốc",
    nameEn: "Five of Cups",
    upright: ["mất mát, tiếc nuối", "loss, regret", "Nỗi buồn cần được thừa nhận, nhưng không phải mọi nguồn nâng đỡ đều đã mất.", "Grief deserves acknowledgment, but not every source of support is gone."],
    reversed: ["chấp nhận, hồi phục", "acceptance, recovery", "Bạn đang dần quay lại với điều còn lại và cho phép mình bước tiếp.", "You are turning toward what remains and allowing yourself to move forward."],
  },
  {
    nameVi: "Sáu Cốc",
    nameEn: "Six of Cups",
    upright: ["ký ức, trong trẻo", "nostalgia, innocence", "Một ký ức hoặc sự tử tế quen thuộc đang nhắc bạn về điều từng nuôi dưỡng mình.", "A memory or familiar kindness is reminding you of what once nourished you."],
    reversed: ["kẹt trong quá khứ, lý tưởng hóa", "stuck in the past, idealization", "Quá khứ đang được nhớ lại đẹp hơn thực tế; hãy mang bài học về hiện tại thay vì quay lại hình thức cũ.", "The past is being remembered as better than it was; bring the lesson forward instead of returning to the old form."],
  },
  {
    nameVi: "Bảy Cốc",
    nameEn: "Seven of Cups",
    upright: ["nhiều lựa chọn, tưởng tượng", "choices, imagination", "Nhiều khả năng đang hấp dẫn bạn; hãy dùng giá trị thực tế để phân biệt ước mơ với ảo ảnh.", "Many possibilities are attractive; use grounded values to separate vision from illusion."],
    reversed: ["rõ lựa chọn, quá tải", "clarity, overwhelm", "Sự mơ hồ đang giảm khi bạn chấp nhận rằng không thể theo mọi con đường cùng lúc.", "Confusion eases when you accept that not every path can be followed at once."],
  },
  {
    nameVi: "Tám Cốc",
    nameEn: "Eight of Cups",
    upright: ["rời đi, tìm ý nghĩa", "walking away, seeking meaning", "Điều từng đủ đầy không còn nuôi dưỡng bạn; rời đi có thể là một hành động trung thực.", "What once felt sufficient no longer nourishes you; leaving may be an honest act."],
    reversed: ["sợ rời bỏ, quay lại", "fear of leaving, returning", "Bạn đang dao động giữa ở lại và bước đi; hãy xác định điều gì thật sự có thể thay đổi.", "You are wavering between staying and leaving; identify what can actually change."],
  },
  {
    nameVi: "Chín Cốc",
    nameEn: "Nine of Cups",
    upright: ["hài lòng, ước nguyện", "contentment, wish fulfilled", "Một mong muốn có thể được tận hưởng; hãy nhận niềm vui với sự biết ơn và chừng mực.", "A desire can be enjoyed; receive the pleasure with gratitude and proportion."],
    reversed: ["thỏa mãn hời hợt, nuông chiều", "shallow satisfaction, indulgence", "Điều đạt được không lấp đầy khoảng trống như mong đợi; hãy hỏi nhu cầu sâu hơn là gì.", "What you gained did not fill the space as expected; ask what the deeper need is."],
  },
  {
    nameVi: "Mười Cốc",
    nameEn: "Ten of Cups",
    upright: ["hòa hợp, thuộc về", "harmony, belonging", "Sự đủ đầy cảm xúc được tạo nên từ an toàn, chia sẻ và những giá trị sống cùng nhau.", "Emotional fulfillment grows from safety, sharing, and values lived together."],
    reversed: ["bất hòa, kỳ vọng gia đình", "disharmony, family expectations", "Hình ảnh về hạnh phúc đang khác với trải nghiệm thật; cần một cuộc nói chuyện thành thật.", "The image of happiness differs from lived experience; an honest conversation is needed."],
  },
  {
    nameVi: "Tiểu Đồng Cốc",
    nameEn: "Page of Cups",
    upright: ["nhạy cảm, tin nhắn tình cảm", "sensitivity, emotional message", "Một cảm xúc dịu dàng hoặc lời mời sáng tạo đang đến; hãy đón nó bằng sự cởi mở.", "A tender feeling or creative invitation is arriving; meet it with openness."],
    reversed: ["mơ mộng, non nớt cảm xúc", "escapism, emotional immaturity", "Cảm xúc đang được phóng đại hoặc né tránh; hãy gọi đúng tên điều đang xảy ra.", "Emotion is being exaggerated or avoided; name what is actually happening."],
  },
  {
    nameVi: "Hiệp Sĩ Cốc",
    nameEn: "Knight of Cups",
    upright: ["lãng mạn, theo đuổi trái tim", "romance, following the heart", "Một lời mời hoặc lý tưởng đẹp đang thúc bạn tiến tới; hãy giữ cả cảm xúc lẫn thực tế.", "A beautiful invitation or ideal draws you forward; keep both feeling and reality in view."],
    reversed: ["ảo tưởng, hứa suông", "fantasy, empty promises", "Lời nói hấp dẫn chưa được hỗ trợ bằng hành động; hãy quan sát sự nhất quán.", "Appealing words are not supported by action; watch for consistency."],
  },
  {
    nameVi: "Nữ Hoàng Cốc",
    nameEn: "Queen of Cups",
    upright: ["thấu cảm, trực giác", "compassion, intuition", "Sự lắng nghe sâu và ranh giới dịu dàng sẽ giúp cảm xúc được hiểu mà không nhấn chìm bạn.", "Deep listening and gentle boundaries let emotion be understood without overwhelming you."],
    reversed: ["quá nhạy cảm, phụ thuộc cảm xúc", "over-sensitivity, emotional dependence", "Bạn đang hấp thụ quá nhiều cảm xúc của người khác; hãy trở lại ranh giới của mình.", "You are absorbing too much of others' emotion; return to your own boundaries."],
  },
  {
    nameVi: "Vua Cốc",
    nameEn: "King of Cups",
    upright: ["điềm tĩnh, trưởng thành cảm xúc", "composure, emotional maturity", "Cảm xúc mạnh có thể được giữ bằng sự điềm tĩnh, trách nhiệm và lòng trắc ẩn.", "Strong feelings can be held with composure, responsibility, and compassion."],
    reversed: ["kìm nén, thao túng cảm xúc", "repression, emotional manipulation", "Cảm xúc bị giấu hoặc dùng để kiểm soát; cần sự minh bạch và khoảng cách lành mạnh.", "Emotion is hidden or used for control; transparency and healthy distance are needed."],
  },
]);

const swords = buildSuit("swords", [
  {
    nameVi: "Át Kiếm",
    nameEn: "Ace of Swords",
    upright: ["rõ ràng, sự thật", "clarity, truth", "Một nhận thức sắc bén đang cắt qua sự mơ hồ; hãy dùng sự thật để mở đường, không phải để gây tổn thương.", "A sharp realization cuts through confusion; use truth to open a path, not to wound."],
    reversed: ["rối trí, phán đoán sai", "confusion, poor judgment", "Thông tin chưa đủ rõ để kết luận; hãy kiểm tra giả định và cách diễn đạt.", "The information is not clear enough for a conclusion; examine assumptions and wording."],
  },
  {
    nameVi: "Hai Kiếm",
    nameEn: "Two of Swords",
    upright: ["bế tắc, quyết định khó", "stalemate, difficult choice", "Hai lựa chọn đang giữ nhau cân bằng; thêm dữ kiện hoặc một tiêu chí thật sẽ giúp bạn quyết định.", "Two options hold each other in balance; more evidence or one honest criterion can help you choose."],
    reversed: ["quá tải thông tin, lộ sự thật", "overload, truth revealed", "Việc trì hoãn không còn giữ được thế cân bằng; hãy chọn dựa trên điều đã biết thay vì đợi chắc chắn tuyệt đối.", "Delay can no longer preserve balance; choose from what is known instead of waiting for certainty."],
  },
  {
    nameVi: "Ba Kiếm",
    nameEn: "Three of Swords",
    upright: ["đau lòng, chia cắt", "heartbreak, separation", "Một sự thật đau đang cần được cảm nhận trực tiếp; gọi đúng tên nỗi đau sẽ bắt đầu quá trình lành lại.", "A painful truth needs to be felt directly; naming the hurt begins healing."],
    reversed: ["hồi phục, nỗi đau còn lại", "recovery, lingering pain", "Vết thương đang khép nhưng vẫn cần thời gian và sự thành thật để không lặp lại.", "The wound is closing but still needs time and honesty so the pattern does not repeat."],
  },
  {
    nameVi: "Bốn Kiếm",
    nameEn: "Four of Swords",
    upright: ["nghỉ ngơi, phục hồi", "rest, recovery", "Tâm trí cần một khoảng ngừng thật sự; nghỉ ngơi lúc này là công việc cần thiết.", "The mind needs a genuine pause; rest is necessary work right now."],
    reversed: ["bồn chồn, kiệt sức kéo dài", "restlessness, burnout", "Bạn đang quay lại hoạt động trước khi phục hồi đủ; hãy bảo vệ một khoảng nghỉ không bị gián đoạn.", "You are returning before recovery is complete; protect a period of uninterrupted rest."],
  },
  {
    nameVi: "Năm Kiếm",
    nameEn: "Five of Swords",
    upright: ["xung đột, thắng bằng mọi giá", "conflict, winning at a cost", "Một chiến thắng có thể để lại tổn thất lớn hơn lợi ích; hãy cân nhắc điều quan trọng sau cuộc tranh cãi.", "A victory may cost more than it gives; consider what must remain after the argument."],
    reversed: ["hòa giải, oán giận còn lại", "reconciliation, lingering resentment", "Cánh cửa hòa giải đang mở nhưng cần thừa nhận tổn thương thay vì phủ nhận.", "Reconciliation is possible, but harm must be acknowledged rather than denied."],
  },
  {
    nameVi: "Sáu Kiếm",
    nameEn: "Six of Swords",
    upright: ["chuyển tiếp, rời vùng khó", "transition, moving on", "Bạn đang rời khỏi một giai đoạn khó khăn; hành trình có thể chậm nhưng hướng đi là lành mạnh.", "You are leaving a difficult phase; the journey may be slow, but the direction is healthier."],
    reversed: ["mang theo quá khứ, khó rời đi", "baggage, difficulty leaving", "Một phần chưa được xử lý đang kéo bạn trở lại; hãy mang theo bài học, không mang toàn bộ gánh nặng.", "Something unresolved pulls you back; carry the lesson, not the entire burden."],
  },
  {
    nameVi: "Bảy Kiếm",
    nameEn: "Seven of Swords",
    upright: ["chiến lược, kín đáo", "strategy, discretion", "Tình huống cần cách tiếp cận khôn ngoan và kín đáo; hãy chắc rằng chiến lược không biến thành thiếu trung thực.", "The situation calls for a careful strategy; make sure discretion does not become dishonesty."],
    reversed: ["thú nhận, tự lừa dối", "confession, self-deception", "Điều bị giấu đang trở nên khó duy trì; sự thật sớm sẽ ít tổn hại hơn.", "What is hidden is becoming hard to sustain; earlier honesty will cause less harm."],
  },
  {
    nameVi: "Tám Kiếm",
    nameEn: "Eight of Swords",
    upright: ["tự giới hạn, cảm giác mắc kẹt", "self-limitation, feeling trapped", "Nỗi sợ đang làm các lựa chọn trông ít hơn thực tế; hãy tìm một chuyển động nhỏ vẫn nằm trong quyền của bạn.", "Fear is making your options look smaller than they are; find one small move still within your control."],
    reversed: ["giải phóng, thấy lựa chọn", "release, seeing options", "Bạn đang nhận ra chiếc khóa không hoàn toàn nằm bên ngoài; một giới hạn cũ có thể được nới.", "You are realizing the lock is not entirely external; an old limit can be loosened."],
  },
  {
    nameVi: "Chín Kiếm",
    nameEn: "Nine of Swords",
    upright: ["lo âu, mất ngủ", "anxiety, sleeplessness", "Tâm trí đang phóng đại nỗi sợ trong cô độc; hãy đưa điều đáng lo ra ánh sáng và tìm hỗ trợ.", "The mind magnifies fear in isolation; bring the worry into daylight and seek support."],
    reversed: ["bớt lo, nỗi sợ sâu", "relief, deep fear", "Lo âu có thể đang giảm hoặc bị giấu kỹ hơn; hãy quan sát tác động lên cơ thể và nhịp sống.", "Anxiety may be easing or moving deeper underground; notice its effect on body and routine."],
  },
  {
    nameVi: "Mười Kiếm",
    nameEn: "Ten of Swords",
    upright: ["kết thúc, chạm đáy", "ending, rock bottom", "Một tình huống đã đi đến giới hạn cuối; điều tốt là bạn không còn phải duy trì nó như cũ.", "A situation has reached its final limit; the relief is that it no longer has to be maintained."],
    reversed: ["hồi sinh, kéo dài kết thúc", "recovery, resisting an ending", "Quá trình hồi phục đã bắt đầu, nhưng chấp nhận điểm kết thúc sẽ giúp nó tiến nhanh hơn.", "Recovery has begun, and accepting the ending will help it continue."],
  },
  {
    nameVi: "Tiểu Đồng Kiếm",
    nameEn: "Page of Swords",
    upright: ["tò mò, quan sát", "curiosity, observation", "Một câu hỏi mới cần được nghiên cứu kỹ; hãy giữ trí óc mở và lời nói chính xác.", "A new question deserves careful study; keep your mind open and your words precise."],
    reversed: ["tin đồn, phòng thủ bằng lời", "gossip, defensive speech", "Thông tin đang chạy nhanh hơn hiểu biết; hãy kiểm chứng trước khi nói hoặc phản ứng.", "Information is moving faster than understanding; verify before speaking or reacting."],
  },
  {
    nameVi: "Hiệp Sĩ Kiếm",
    nameEn: "Knight of Swords",
    upright: ["quyết liệt, hành động nhanh", "assertiveness, swift action", "Sự rõ ràng tạo ra tốc độ; hãy tiến thẳng nhưng giữ chỗ cho dữ kiện mới.", "Clarity creates speed; move directly while leaving room for new evidence."],
    reversed: ["hung hăng, thiếu kế hoạch", "aggression, poor planning", "Quyết tâm đang biến thành lao tới; chậm một nhịp sẽ tránh tổn hại không cần thiết.", "Determination is becoming a charge; one pause can prevent unnecessary harm."],
  },
  {
    nameVi: "Nữ Hoàng Kiếm",
    nameEn: "Queen of Swords",
    upright: ["sáng suốt, ranh giới rõ", "discernment, clear boundaries", "Lòng trắc ẩn và sự thật có thể cùng tồn tại; hãy nói rõ điều cần nói mà không thêm cay nghiệt.", "Compassion and truth can coexist; say what is needed without adding cruelty."],
    reversed: ["cay nghiệt, thành kiến", "bitterness, bias", "Một vết thương cũ đang định hình phán đoán hiện tại; hãy tách dữ kiện khỏi phản ứng.", "An old wound is shaping present judgment; separate evidence from reaction."],
  },
  {
    nameVi: "Vua Kiếm",
    nameEn: "King of Swords",
    upright: ["lý trí, thẩm quyền", "reason, authority", "Quyết định tốt cần nguyên tắc rõ, dữ kiện đáng tin và cách áp dụng nhất quán.", "A sound decision needs clear principles, reliable evidence, and consistent application."],
    reversed: ["lạm quyền, lạnh lùng", "misused authority, coldness", "Lý trí đang bị dùng để áp đảo hoặc hợp thức hóa một kết luận sẵn có.", "Reason is being used to dominate or justify a conclusion already chosen."],
  },
]);

const pentacles = buildSuit("pentacles", [
  {
    nameVi: "Át Tiền",
    nameEn: "Ace of Pentacles",
    upright: ["cơ hội thực tế, khởi đầu", "material opportunity, beginning", "Một cơ hội hữu hình đang xuất hiện; giá trị của nó sẽ được chứng minh qua cách bạn chăm sóc từ đầu.", "A tangible opportunity is appearing; its value will be proven by how you tend it from the start."],
    reversed: ["cơ hội bỏ lỡ, nền móng yếu", "missed chance, weak foundation", "Một khởi đầu thực tế đang thiếu chuẩn bị hoặc bị đánh giá sai chi phí.", "A practical beginning lacks preparation or has underestimated its cost."],
  },
  {
    nameVi: "Hai Tiền",
    nameEn: "Two of Pentacles",
    upright: ["cân đối, thích nghi", "balance, adaptability", "Nhiều trách nhiệm có thể được giữ nếu bạn điều chỉnh nhịp linh hoạt và biết điều gì được ưu tiên.", "Several responsibilities can be held with a flexible rhythm and clear priorities."],
    reversed: ["quá tải, mất cân đối", "overload, imbalance", "Quá nhiều việc đang tranh cùng một nguồn lực; hãy bỏ hoặc hoãn ít nhất một việc.", "Too many tasks compete for the same resource; drop or delay at least one."],
  },
  {
    nameVi: "Ba Tiền",
    nameEn: "Three of Pentacles",
    upright: ["hợp tác, tay nghề", "teamwork, craftsmanship", "Chất lượng tăng lên khi kỹ năng khác nhau được phối hợp bằng tiêu chuẩn chung.", "Quality improves when different skills work toward a shared standard."],
    reversed: ["phối hợp kém, làm việc qua loa", "poor teamwork, weak craft", "Vai trò hoặc tiêu chuẩn chưa rõ đang làm kết quả rời rạc; cần phản hồi cụ thể hơn.", "Unclear roles or standards are fragmenting the result; more specific feedback is needed."],
  },
  {
    nameVi: "Bốn Tiền",
    nameEn: "Four of Pentacles",
    upright: ["giữ chặt, an toàn", "security, holding on", "Việc bảo vệ nguồn lực là hợp lý, nhưng giữ quá chặt có thể ngăn chúng lưu thông và phát triển.", "Protecting resources is reasonable, but holding too tightly can stop growth and circulation."],
    reversed: ["buông kiểm soát, bất an tài chính", "release, financial insecurity", "Bạn đang học cách nới tay hoặc đối diện nỗi sợ thiếu thốn; hãy buông có kế hoạch.", "You are loosening control or facing scarcity fears; release with a plan."],
  },
  {
    nameVi: "Năm Tiền",
    nameEn: "Five of Pentacles",
    upright: ["thiếu thốn, bị bỏ rơi", "hardship, exclusion", "Khó khăn đang làm bạn cảm thấy đơn độc, nhưng một nguồn hỗ trợ có thể gần hơn bạn nghĩ.", "Hardship makes you feel alone, yet support may be closer than it appears."],
    reversed: ["phục hồi, nhận hỗ trợ", "recovery, receiving help", "Điều kiện đang cải thiện khi bạn cho phép mình nhận trợ giúp và xây lại từng bước.", "Conditions improve as you accept help and rebuild step by step."],
  },
  {
    nameVi: "Sáu Tiền",
    nameEn: "Six of Pentacles",
    upright: ["cho nhận, hào phóng", "giving, receiving", "Nguồn lực được trao đúng cách có thể tạo cân bằng; hãy nhìn rõ cả nhu cầu lẫn quyền lực trong sự trao đổi.", "Resources shared well can restore balance; notice both need and power in the exchange."],
    reversed: ["món nợ, cho có điều kiện", "debt, strings attached", "Sự giúp đỡ đang đi kèm điều kiện không rõ hoặc cán cân quyền lực lệch.", "Help comes with unclear conditions or an uneven balance of power."],
  },
  {
    nameVi: "Bảy Tiền",
    nameEn: "Seven of Pentacles",
    upright: ["kiên nhẫn, đánh giá tiến độ", "patience, assessment", "Kết quả cần thêm thời gian; đây là lúc đánh giá cách làm và điều chỉnh thay vì bỏ cuộc.", "Results need more time; assess the method and adjust rather than quitting."],
    reversed: ["thiếu kiên nhẫn, đầu tư kém", "impatience, poor return", "Nỗ lực đang không tạo giá trị tương xứng; hãy xem nên đổi cách hay dừng đầu tư.", "Effort is not producing enough value; decide whether to change the method or stop investing."],
  },
  {
    nameVi: "Tám Tiền",
    nameEn: "Eight of Pentacles",
    upright: ["rèn nghề, tập trung", "craft, focused practice", "Sự tiến bộ đến từ lặp lại có chủ đích và chú ý đến từng chi tiết nhỏ.", "Progress comes from deliberate repetition and attention to small details."],
    reversed: ["cầu toàn, làm việc hời hợt", "perfectionism, careless work", "Bạn đang mắc kẹt giữa quá kỹ và quá vội; hãy trở lại một tiêu chuẩn đủ tốt và đều đặn.", "You are caught between overworking and rushing; return to a steady, good-enough standard."],
  },
  {
    nameVi: "Chín Tiền",
    nameEn: "Nine of Pentacles",
    upright: ["độc lập, thành quả", "independence, earned comfort", "Bạn có thể tận hưởng thành quả do sự kiên trì tạo nên mà không cần xin phép ai.", "You can enjoy the comfort built through your own persistence without seeking permission."],
    reversed: ["phụ thuộc, vẻ ngoài thành công", "dependence, appearance of success", "Hình ảnh đủ đầy đang che một sự phụ thuộc hoặc cái giá quá cao.", "An image of abundance is hiding dependence or an unsustainable cost."],
  },
  {
    nameVi: "Mười Tiền",
    nameEn: "Ten of Pentacles",
    upright: ["di sản, bền vững", "legacy, long-term stability", "Điều đang được xây có thể vượt khỏi lợi ích trước mắt và trở thành nền tảng cho nhiều người.", "What is being built can outlast immediate gain and become a foundation for others."],
    reversed: ["bất ổn dài hạn, xung đột tài sản", "instability, legacy conflict", "Kỳ vọng về tiền bạc, gia đình hoặc di sản đang thiếu đồng thuận rõ ràng.", "Expectations around money, family, or legacy lack clear agreement."],
  },
  {
    nameVi: "Tiểu Đồng Tiền",
    nameEn: "Page of Pentacles",
    upright: ["học hỏi, cơ hội mới", "study, practical opportunity", "Một kỹ năng hoặc kế hoạch thực tế đáng được học nghiêm túc từ những bước căn bản.", "A practical skill or plan deserves serious study from the basics."],
    reversed: ["trì hoãn, thiếu cam kết", "procrastination, poor follow-through", "Ý định tốt chưa thành thói quen; hãy tạo một lịch học hoặc bước làm cụ thể.", "Good intention has not become a habit; set a concrete practice or study schedule."],
  },
  {
    nameVi: "Hiệp Sĩ Tiền",
    nameEn: "Knight of Pentacles",
    upright: ["bền bỉ, trách nhiệm", "diligence, reliability", "Tiến độ chậm nhưng chắc đang tạo nền tảng đáng tin; hãy tiếp tục quy trình đã chứng minh hiệu quả.", "Slow, steady progress is building a reliable foundation; continue the process that works."],
    reversed: ["trì trệ, làm việc máy móc", "stagnation, dull routine", "Kỷ luật đã biến thành lặp lại không mục đích; hãy điều chỉnh quy trình mà không bỏ cam kết.", "Discipline has become empty repetition; refresh the method without abandoning commitment."],
  },
  {
    nameVi: "Nữ Hoàng Tiền",
    nameEn: "Queen of Pentacles",
    upright: ["thực tế, chăm sóc", "practical care, resourcefulness", "Sự chăm sóc hiệu quả kết hợp ấm áp với khả năng quản lý thời gian và nguồn lực.", "Effective care combines warmth with capable management of time and resources."],
    reversed: ["bỏ quên bản thân, mất cân bằng việc nhà", "self-neglect, work-home imbalance", "Bạn đang giữ mọi thứ vận hành bằng cách tiêu hao chính mình; cần phân chia lại trách nhiệm.", "You are keeping everything running by spending yourself; responsibilities need redistribution."],
  },
  {
    nameVi: "Vua Tiền",
    nameEn: "King of Pentacles",
    upright: ["ổn định, quản trị", "stability, stewardship", "Nguồn lực được phát triển tốt nhất qua kỷ luật, kinh nghiệm và trách nhiệm dài hạn.", "Resources grow best through discipline, experience, and long-term stewardship."],
    reversed: ["tham lam, kiểm soát bằng vật chất", "greed, material control", "Sự an toàn vật chất đang bị dùng để đo giá trị hoặc kiểm soát người khác.", "Material security is being used to measure worth or control others."],
  },
]);

export const minorCardSeeds = [...wands, ...cups, ...swords, ...pentacles];
