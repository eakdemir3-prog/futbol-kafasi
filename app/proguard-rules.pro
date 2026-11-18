# Futbol Kafası — R8 kuralları
# WebView köprüsü: JS'den çağrılan metotlar silinmemeli / yeniden adlandırılmamalı
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }
-keepattributes JavascriptInterface,*Annotation*,Signature,InnerClasses,EnclosingMethod
-keep class com.eavisionlabs.futbolkafasi.** { *; }
# Firebase / Google Play hizmetleri / kimlik bilgileri (kütüphanelerin kendi kuralları da var; ek güvence)
-keep class com.google.android.libraries.identity.googleid.** { *; }
-keep class androidx.credentials.** { *; }
-dontwarn com.google.android.libraries.identity.googleid.**
-keepattributes SourceFile,LineNumberTable
