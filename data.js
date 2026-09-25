'use strict';
// Historical information is sourced below; reflections and teaching scenarios are authored interpretation.
const EXHIBITION = {
  years: ['1911','1934','1936','1939','1947','1952','1985'],
  milestones: {
    '1911': {place:'江苏 · 江阴', location:'jiangyin', suffix:'年', title:'从江南出发，走向广阔世界。', body:'李旭旦出生于江苏江阴。这位后来的人文地理学家与地理教育家，将一生的工作与理解土地、培养学人联系在一起。', reflection:'每一次向世界出发，都有一个身后的地方。'},
    '1934': {place:'南京 · 中央大学', location:'nanjing', suffix:'年', title:'由学生，走向讲台。', body:'从中央大学地理系毕业后，李旭旦留校担任助教。学习与教学在此交汇，也成为他此后长期从事地理教育的起点。', reflection:'把知识讲清楚，也是在重新理解它。'},
    '1936': {place:'英国 · 剑桥大学', location:'cambridge', suffix:'年', title:'远行求学，打开地理的视野。', body:'李旭旦获中英庚款奖学金，赴英国剑桥大学学习地理。新的学术环境为他此后的研究和译介提供了养分。', reflection:'开阔视野，是为了提出更好的问题。'},
    '1939': {place:'中国 · 回国任教', location:'chongqing', suffix:'年', title:'把所学，带回自己的土地。', body:'结束在英国的学习后，李旭旦回国，在当时迁至重庆的中央大学任教。此后，他持续思考国外地理思想如何与中国的实际问题相联系。', reflection:'学问的价值，也在于它回应了什么。'},
    '1947': {place:'学术研究 · 综合地理分区', location:'nanjing', suffix:'年', title:'理解一个地方，需要多种目光。', body:'在《中国地理区之划分》中，李旭旦提出综合地理分区的思路：区域的形成与差异，应同时从自然条件和人类活动中寻找解释。', reflection:'先把线索放在一起，再下判断。'},
    '1952': {place:'南京 · 南京师范学院', location:'nanjing', suffix:'年后', title:'一间课堂，延伸出新的道路。', body:'院系调整之后，李旭旦在南京师范学院创建地理系，并先后承担系主任、名誉系主任等工作。他把学术思考延续为学科建设与人才培养。', reflection:'育人，让一个人的求索成为更多人的起点。'},
    '1985': {place:'学术留泽 · 继续阅读', location:'nanjing', suffix:'年', title:'书页合上，求索仍在继续。', body:'李旭旦于1985年逝世。由他主编的《人文地理学论丛》《人文地理学概说》也在这一年出版。著作和后来学人的回望，留下可继续阅读的线索。', reflection:'传承不止是记住名字，也包括继续追问。'}
  },
  observations: {
    mountain:{layer:'nature',kicker:'自然环境 / 山地',character:'山',title:'地形，怎样参与日常生活？',body:'坡度、地势与河谷，为道路和聚落提供了不同条件。但地形并不单独决定生活：技术、历史与社会选择，也在塑造地方。'},
    river:{layer:'nature',kicker:'自然环境 / 河流',character:'水',title:'一条河，联系着什么？',body:'河流不仅是地图上的线条。水源、通行与沿岸生活，都可能与它相关。打开聚落和活动图层，看看水与人的日常如何相遇。'},
    village:{layer:'settlement',kicker:'聚落分布 / 居住',character:'居',title:'人们为什么在这里生活？',body:'留意聚落与河流、田地、道路的相对位置。一个村庄的形成，可能同时包含取水、生产、交通与历史积累的原因；仅凭一张图，还不能确定答案。'},
    field:{layer:'settlement',kicker:'聚落分布 / 生产',character:'田',title:'田地里，也有人地关系。',body:'土地和水为生产提供条件，人的劳动、技术与组织方式也在改变景观。观察田地，不只是辨认一种用地，还可以追问人如何利用和照料土地。'},
    path:{layer:'connection',kicker:'人的活动 / 往来',character:'行',title:'把孤立的点，连成生活。',body:'道路把居住、劳动和交流连接起来。三个图层同时展开时，试着沿一条路想象：谁在往来？去做什么？还有哪些信息，需要走到现场才能知道？'}
  },
  sites: {
    riverside:{label:'A · 河湾旁',normal:{environment:'临近溪流，需调查河岸稳定性、历史水位与取水条件。',access:'靠近西村，但东村学生可能需要过河，通行条件仍待核实。',community:'邻近农田与日常取水空间，需了解现有使用者的需求。'},rain:{environment:'情境假设水位上涨，河湾周边的积水与洪水风险需要优先核查。',access:'原本较短的路线，可能因为过河条件变差而变得不便。',community:'应调查雨季居民的生产与出行变化，避免只看平日的便利。'},questions:{environment:'向居民了解往年最高水位，再核对地形与水文资料。',access:'分别跟随两村学生走一遍通学路线，记录过河方式和雨天变化。',community:'访谈附近农户，了解土地使用、取水与日常活动是否会受到影响。'}},
    hillside:{label:'B · 缓坡上',normal:{environment:'相对远离河湾，但坡度、地基与排水仍需实际测量。',access:'往返两村可能需要爬坡，距离和体力负担都应纳入考虑。',community:'位置较安静，但供水、建设条件和周边服务需要进一步了解。'},rain:{environment:'地势较高不等于天然安全，还要排查坡面径流和地质条件。',access:'雨天坡路可能湿滑，路面材料、坡度和维护情况会影响通行。',community:'要了解雨季供水、送餐和应急车辆通达等日常保障。'},questions:{environment:'请专业人员调查坡度、土层、地质稳定性和雨水去向。',access:'测量实际步行坡度与时间，并听取不同年龄学生的感受。',community:'核实供水、用地和日常服务的条件，而不是只凭安静作决定。'}},
    crossroads:{label:'C · 道路交会处',normal:{environment:'道路交会带来可达性，也可能带来噪声、尾气与交通冲突。',access:'概念图上连接两村较方便，实际安全性取决于路况和过街方式。',community:'可能方便共享公共设施，也需要协调原有交通与经营活动。'},rain:{environment:'低洼路段可能积水，应结合地形调查，不能只看道路数量。',access:'需了解雨天能见度、车流与路面积水对学生过街的影响。',community:'应关注接送、候车与避雨空间，听取周边居民和经营者意见。'},questions:{environment:'分时段观察噪声、车流与积水情况，并核实是否有其他环境影响。',access:'在上下学时段记录车速、过街需求及行人与车辆的交叉点。',community:'邀请两村居民讨论共享设施、交通秩序与学校周边空间如何安排。'}}
  },
  books:[
    {title:'人地学原理',year:'1935',role:'任美锷、李旭旦合译',type:'译介 / 从青年时代开始',seal:'译',source:'source-06',description:'求学期间，李旭旦与同窗任美锷合作翻译白吕纳的著作。这是两位青年学者把国外地理思想带入中文阅读的早期实践。南京大学学术目录记载该译本于1935年由钟山书局出版。',question:'当一种思想被译成另一种语言，它会为读者打开什么新的视野？'},
    {title:'地理学思想史',year:'1982',role:'李旭旦译',type:'译介 / 看见观念的来路',seal:'思',source:'source-08',description:'这里介绍的是商务印书馆1982年版：普雷斯顿·詹姆斯著，李旭旦译。沿着学科观念的变化阅读世界，是他晚年译介工作的一部分，也为理解不同地理学观点提供了入口。',question:'一门学科不断改变的提问方式，会怎样影响我们观察同一个地方？'},
    {title:'人文地理学论丛',year:'1985',role:'李旭旦主编',type:'编著 / 汇集学科的讨论',seal:'论',source:'source-07',description:'这部由李旭旦主编、人民教育出版社出版的论文集，收录了他撰写的《人文地理学引论》。把不同讨论汇集成书，也是他晚年推动人文地理学研究的工作线索。',question:'不同研究者面对同一个问题，为什么可能提出不同的解释？'},
    {title:'人文地理学概说',year:'1985',role:'李旭旦主编',type:'编著 / 展开多样的路径',seal:'观',source:'source-03',extraSource:'source-07',description:'这部科学出版社图书邀请多位学者介绍人文地理的不同方向。人口、城市、文化、旅游等主题在同一部书中展开，显示出理解人类活动的多种路径。署名及年份另据同济大学馆藏书目核对。',question:'如果从家乡出发，你最想沿着人口、城市、文化中的哪一条线索继续研究？'}
  ],
  evidence:[
    {statement:'李旭旦于1939年回国，继续从事地理研究与教学。',answer:'fact',explanation:'这是一条可查证的生平信息。机构人物介绍与学术文献可用于核对年份、地点和经历。',source:'source-01'},
    {statement:'“图上每一个点，都值得走近一点。”',answer:'expression',explanation:'这是本展的创作者寄语，用来表达观察与求知的愿望，并非李旭旦说过的话。'},
    {statement:'山谷图上的河流、聚落、道路，以及“溪谷乡”的学堂候选点。',answer:'concept',explanation:'这些是帮助思考的概念示意和虚构教学情境，没有真实地理坐标，不能据此推断历史地点或实际选址结果。'}
  ],
  sources:[
    {id:'source-01',type:'人物资料 / 中国科学院地理科学与资源研究所',title:'地理教育家——李旭旦',description:'生平、区域地理研究与人地关系思想的主要参考。',url:'https://igsnrr.cas.cn/cbkx/kpyd/dlxj/202009/t20200910_5692705.html'},
    {id:'source-02',type:'学术文献 / 《地理学报》1986，41(4)',title:'李旭旦先生对我国地理学的贡献',description:'宋家泰、吴传钧、金其铭著；从学术贡献回望他的地理人生。',url:'https://www.geog.com.cn/CN/abstract/article/0375-5444/20460'},
    {id:'source-03',type:'出版资料 / 科学出版社',title:'《人文地理学概说》内容简介与目录',description:'查阅全书的主题范围、章节与作者分工；署名及年份同时参考资料07。',url:'https://www.ecsponline.com/goods.php?id=18445'},
    {id:'source-04',type:'校友资料 / 东南大学校友总会',title:'李旭旦（1911—1985）',description:'核对江阴籍贯、1934年毕业与1939年回国等经历。',url:'https://seuaa.seu.edu.cn/2008/0116/c1672a25963/page.htm'},
    {id:'source-05',type:'学科史 / 南京大学地理与海洋科学学院',title:'百年地理 · 惟实励新',description:'理解李旭旦、任美锷等人与中央大学地理学科的联系。',url:'https://sgos.nju.edu.cn/bnyq/af/ff/c47087a569343/page.htm'},
    {id:'source-06',type:'学术目录 / 南京大学',title:'任美锷学术目录',description:'第17项记载《人地学原理》的合译者、出版社与1935年出版信息。',url:'https://www.nju.edu.cn/info/3891/408431.htm'},
    {id:'source-07',type:'馆藏书目 / 同济大学图书馆',title:'两部人文地理著作的书目信息',description:'核对《人文地理学论丛》《人文地理学概说》的主编与1985年出版信息。',url:'https://webpac.tongji.edu.cn/opac/openlink.php?count=25&displaypg=20&doctype=ALL&lang_code=ALL&location=ALL&match_flag=forward&onlylendable=yes&orderby=DESC&page=2&showmode=list&sort=CATA_DATE&title=%E4%BA%BA%E6%96%87%E5%9C%B0%E7%90%86%E5%AD%A6&with_ebook=off'},
    {id:'source-08',type:'馆藏书目 / 陕西省委党校图书馆',title:'《地理学思想史》1982年版',description:'核对普雷斯顿·詹姆斯著、李旭旦译及商务印书馆版本信息。',url:'https://pear.ilovelibrary.cn/sxswdx/book.aspx?BiblioRecPath=%E5%9B%BE%E4%B9%A6%E6%80%BB%E5%BA%93/222464'},
    {id:'source-09',type:'学术研究 / 《地理研究》2013，32(7)',title:'李旭旦先生的学术翻译及其反映的学术理念',description:'汤茂林著；进一步了解译介工作、学术交流与人文地理学发展的关系。',url:'https://www.dlyj.ac.cn/CN/Y2013/V32/I7/1364'}
  ],
  themes:{
    knowledge:{character:'知',title:'求知',line:'山河广大，值得多问一个为什么。',color:'#2e5047',note:'下一次出发，带着一个新的问题。'},
    truth:{character:'实',title:'求实',line:'走近土地，也走近事情的来由。',color:'#965443',note:'先观察，再求证，让判断有依据。'},
    education:{character:'育',title:'育人',line:'把眼中的世界，讲给后来的人。',color:'#665c40',note:'把今天的发现，分享给另一个人。'}
  }
};
