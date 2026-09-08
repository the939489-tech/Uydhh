const $ = s => document.querySelector(s);
const slides = $("#slides"), dots = $("#dots"), tabs = $("#tabs"), sections = $("#sections");
let current = 0, selected = null;

function initHeroes(){
  HEROES.forEach((h,i)=>{
    const s=document.createElement("article");
    s.className="slide "+(i===0?"active":"");
    s.style.backgroundImage=`url('${h.image}')`;
    s.innerHTML=`<div class="slide-copy"><b>${h.title}</b><small>${h.subtitle}</small></div>`;
    slides.appendChild(s);
    const d=document.createElement("button"); d.className=i===0?"active":""; d.onclick=()=>showSlide(i); dots.appendChild(d);
  });
}
function showSlide(i){
  current=i;
  document.querySelectorAll(".slide").forEach((x,n)=>x.classList.toggle("active",n===i));
  document.querySelectorAll(".dots button").forEach((x,n)=>x.classList.toggle("active",n===i));
}
setInterval(()=>showSlide((current+1)%HEROES.length),5000);

function initStore(){
  CATEGORIES.forEach((cat,index)=>{
    const tab=document.createElement("button");
    tab.className="tab "+(index===0?"active":"");
    tab.dataset.target=cat.id;
    tab.innerHTML=`<span>${cat.icon}</span>${cat.name}`;
    tab.onclick=()=>document.getElementById(cat.id).scrollIntoView({behavior:"smooth",block:"start"});
    tabs.appendChild(tab);

    const sec=document.createElement("section");
    sec.className="product-section"; sec.id=cat.id;
    sec.innerHTML=`<div class="section-head"><div><small>EXPLORE CATEGORY</small><h2>${cat.name}</h2></div><span>${cat.products.length} PRODUCTS</span></div>
      <div class="product-track">${[...cat.products,...cat.products].map(p=>card(p)).join("")}</div>`;
    sections.appendChild(sec);
  });
}
function card(p){
  return `<article class="product" onclick='openProduct(${JSON.stringify(p)})'>
    <div class="product-img">${p.image?`<img src="${p.image}" onerror="this.style.display='none'">`:""}<span>AL</span></div>
    <div class="product-info"><h3>${p.name}</h3><strong>${p.price.toLocaleString("ar-EG")} ج.م</strong></div>
  </article>`;
}
function openProduct(p){
  selected={...p,qty:1};
  $("#modalContent").innerHTML=`<div class="step">01 / PRODUCT</div><div class="big-product">${p.image?`<img src="${p.image}" onerror="this.style.display='none'">`:""}<span>AL</span></div>
  <h2>${p.name}</h2><div class="price">${p.price.toLocaleString("ar-EG")} ج.م</div>
  <div class="qty"><button onclick="changeQty(-1)">−</button><b id="qty">1</b><button onclick="changeQty(1)">+</button></div>
  <button class="primary" onclick="goPayment()">شراء الآن</button>`;
  $("#productModal").classList.add("show");
}
function changeQty(n){ selected.qty=Math.max(1,selected.qty+n); $("#qty").textContent=selected.qty; }
function goPayment(){
  $("#productModal").classList.remove("show");
  $("#payTotal").textContent=(selected.price*selected.qty).toLocaleString("ar-EG")+" ج.م";
  $("#transferInfo").innerHTML=`<b>${STORE_CONFIG.transfer.method}</b><span>${STORE_CONFIG.transfer.number}</span><small>المستلم: ${STORE_CONFIG.transfer.receiver}</small>`;
  $("#payModal").classList.add("show");
}
$("#paidBtn").onclick=()=>{
  const total=selected.price*selected.qty;
  const msg=`🎮 طلب جديد - ${STORE_CONFIG.name}%0A🛍️ المنتج: ${selected.name}%0A🔢 الكمية: ${selected.qty}%0A💰 الإجمالي: ${total} جنيه%0A%0A✅ أتممت التحويل وأرغب في تأكيد الطلب.`;
  $("#payModal").classList.remove("show");
  alert("✅ تم استلام طلبك! سيتم فتح WhatsApp لإرسال تفاصيل الطلب.");
  window.open(`https://wa.me/${STORE_CONFIG.whatsapp}?text=${msg}`,"_blank");
};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>b.closest(".modal").classList.remove("show"));
document.addEventListener("click",e=>{if(e.target.classList.contains("modal"))e.target.classList.remove("show")});

let progress=0;
const timer=setInterval(()=>{
  progress+=Math.floor(Math.random()*12)+6; progress=Math.min(progress,100);
  $("#loadPercent").textContent=progress+"%"; document.querySelector(".loader-line i").style.width=progress+"%";
  if(progress>=100){clearInterval(timer);setTimeout(()=>$("#loader").classList.add("done"),450);}
},120);

initHeroes(); initStore();