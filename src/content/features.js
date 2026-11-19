export const FEATURES = {
  en: {
    compare: {
      title: "Compare schools", eyebrow: "Your shortlist", subtitle: "Compare up to four schools side by side, then discuss your shortlist with an adviser.",
      add: "Compare", added: "Added", addLabel: name => `Add ${name} to comparison`, removeLabel: name => `Remove ${name} from comparison`,
      remove: "Remove", clear: "Clear all", selected: n => `${n} of 4 selected`, limit: "You can compare up to four schools. Remove one to add another.",
      emptyTitle: "Build your school shortlist", emptyText: "Choose schools from the catalogue or add one here to start comparing.",
      oneNote: "Add another school to see the differences side by side.", addSchool: "Add a school", choose: "Choose a school…", highlight: "Highlight differences", only: "Show differences only",
      noDifferences: "These schools have the same values in the displayed rows.", browse: "Browse schools", view: "View school", apply: "Enquire about shortlist",
      feeNote: "Fees retain their original currencies, academic years and inclusions. Tuition-only and boarding packages are different; no currency conversion or price ranking is applied here.",
      unknown: "Not published / confirm", annual: "Annual equivalent (calculated)", scroll: "Scroll horizontally to compare all schools.",
      rows: { location: "Location", type: "School type", age: "Ages / year groups", students: "Students", fees: "Published headline fee", includes: "Fee inclusions & extras", registration: "Registration & deposit", boarding: "Boarding & accommodation", programmes: "Qualifications", english: "English support", results: "Academic results", admissions: "Intake & entry routes", documents: "Documents", assessments: "Assessments", steps: "Application steps", facilities: "Facilities", district: "Schools in district" },
    },
    shortlist: { title: "Enquire about your shortlist", lead: "Your selected schools will be included with your enquiry. Our advisers will confirm availability, fees and the next steps.", selection: "Selected schools", empty: "No schools selected. You can still send a general enquiry.", add: "Add schools", form: "Tell us about the student" },
    modern: { title: "Find a school that fits your future.", lead: "Explore international high schools, compare your options and plan your next step with an adviser.", discover: "Start with what matters to you", country: "All countries", programme: "All programmes", matches: n => `${n} matching schools`, guidance: "Guidance at every step", approach: "Explore. Compare. Apply.", stepText: ["Find schools by location, qualifications and boarding options.", "Keep your favourites together and compare the details that matter.", "Talk through your shortlist and prepare your application with us."], programmeLabel: "Programme", countryLabel: "Country", subtitle: "A clearer route to your next chapter", details: "Explore school", menu: "Main navigation" },
    quickFinder: { title: "Quick school finder", subtitle: "Pick filters to see matching schools immediately", country: "All countries", programme: "All programmes", boarding: "All boarding types", english: "Offers English-language support", submit: n => (n === 1 ? "List 1 school" : `List ${n} schools`) },
  },
  tr: {
    compare: {
      title: "Okulları karşılaştır", eyebrow: "Okul listeniz", subtitle: "En fazla dört okulu yan yana karşılaştırın; ardından listenizi danışmanınızla değerlendirin.",
      add: "Karşılaştır", added: "Eklendi", addLabel: name => `${name}: karşılaştırmaya ekle`, removeLabel: name => `${name}: karşılaştırmadan çıkar`,
      remove: "Çıkar", clear: "Tümünü temizle", selected: n => `${n} / 4 okul seçildi`, limit: "En fazla dört okulu karşılaştırabilirsiniz. Yeni okul eklemek için birini çıkarın.",
      emptyTitle: "Okul listenizi oluşturun", emptyText: "Karşılaştırmaya başlamak için katalogdan okul seçin veya buradan ekleyin.",
      oneNote: "Farkları yan yana görmek için bir okul daha ekleyin.", addSchool: "Okul ekle", choose: "Okul seçin…", highlight: "Farkları vurgula", only: "Yalnızca farkları göster",
      noDifferences: "Gösterilen satırlarda bu okulların bilgileri aynı.", browse: "Okulları incele", view: "Okulu görüntüle", apply: "Seçtiğim okullar için bilgi al",
      feeNote: "Ücretler özgün para birimleri, akademik yılları ve kapsamlarıyla gösterilir. Yalnızca eğitim ücretleri ile yatılı paketler farklıdır; burada döviz dönüşümü veya fiyat sıralaması uygulanmaz.",
      unknown: "Yayımlanmamış / teyit edilmeli", annual: "Yıllık karşılık (hesaplanmıştır)", scroll: "Tüm okulları karşılaştırmak için tabloyu yatay kaydırın.",
      rows: { location: "Konum", type: "Okul türü", age: "Yaş / sınıf seviyeleri", students: "Öğrenci sayısı", fees: "Yayımlanan ana ücret", includes: "Ücrete dahil olanlar ve ekler", registration: "Kayıt ve depozito", boarding: "Yatılılık ve konaklama", programmes: "Programlar", english: "İngilizce desteği", results: "Akademik sonuçlar", admissions: "Başlangıç ve kabul yolları", documents: "Belgeler", assessments: "Değerlendirmeler", steps: "Başvuru adımları", facilities: "Olanaklar", district: "Bölgedeki okullar" },
    },
    shortlist: { title: "Seçtiğiniz okullar için bilgi alın", lead: "Seçtiğiniz okullar talebinize eklenecektir. Danışmanlarımız kontenjanı, ücretleri ve sonraki adımları teyit eder.", selection: "Seçilen okullar", empty: "Henüz okul seçilmedi. Yine de genel bilgi talebi gönderebilirsiniz.", add: "Okul ekle", form: "Öğrenciyi tanıyalım" },
    modern: { title: "Geleceğinize uygun okulu bulun.", lead: "Uluslararası liseleri keşfedin, seçeneklerinizi karşılaştırın ve bir danışmanla sonraki adımınızı planlayın.", discover: "Sizin için önemli olanlarla başlayın", country: "Tüm ülkeler", programme: "Tüm programlar", matches: n => `${n} uygun okul`, guidance: "Her adımda rehberlik", approach: "Keşfedin. Karşılaştırın. Başvurun.", stepText: ["Konuma, programa ve yatılılık seçeneklerine göre okul bulun.", "Beğendiğiniz okulları bir arada tutun ve önemli ayrıntıları karşılaştırın.", "Listenizi danışmanınızla değerlendirin ve başvurunuzu birlikte hazırlayın."], programmeLabel: "Program", countryLabel: "Ülke", subtitle: "Yeni bir başlangıç için daha net bir yol", details: "Okulu keşfet", menu: "Ana menü" },
    quickFinder: { title: "Hızlı Okul Keşfi", subtitle: "Filtreleri seçin, uygun okulları anında görün", country: "Tüm Ülkeler", programme: "Tüm Programlar", boarding: "Tüm Yatılılık Türleri", english: "İngilizce dil desteği sunanlar", submit: n => `${n} Okulu Listele` },
  },
};
