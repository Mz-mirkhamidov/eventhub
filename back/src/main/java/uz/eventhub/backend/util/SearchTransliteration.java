package uz.eventhub.backend.util;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public final class SearchTransliteration {

    private static final Map<String, String> LATIN_TO_CYRILLIC = Map.ofEntries(
            Map.entry("a", "а"), Map.entry("b", "б"), Map.entry("c", "ц"), Map.entry("d", "д"),
            Map.entry("e", "е"), Map.entry("f", "ф"), Map.entry("g", "г"), Map.entry("h", "ҳ"),
            Map.entry("i", "и"), Map.entry("j", "ж"), Map.entry("k", "к"), Map.entry("l", "л"),
            Map.entry("m", "м"), Map.entry("n", "н"), Map.entry("o", "о"), Map.entry("p", "п"),
            Map.entry("q", "қ"), Map.entry("r", "р"), Map.entry("s", "с"), Map.entry("t", "т"),
            Map.entry("u", "у"), Map.entry("v", "в"), Map.entry("w", "в"), Map.entry("x", "х"),
            Map.entry("y", "й"), Map.entry("z", "з"));

    private static final Map<String, String> CYRILLIC_TO_LATIN = Map.ofEntries(
            Map.entry("а", "a"), Map.entry("б", "b"), Map.entry("в", "v"), Map.entry("г", "g"),
            Map.entry("д", "d"), Map.entry("е", "e"), Map.entry("ж", "j"), Map.entry("з", "z"),
            Map.entry("и", "i"), Map.entry("й", "y"), Map.entry("к", "k"), Map.entry("л", "l"),
            Map.entry("м", "m"), Map.entry("н", "n"), Map.entry("о", "o"), Map.entry("п", "p"),
            Map.entry("р", "r"), Map.entry("с", "s"), Map.entry("т", "t"), Map.entry("у", "u"),
            Map.entry("ф", "f"), Map.entry("х", "x"), Map.entry("ц", "c"), Map.entry("ч", "ch"),
            Map.entry("ш", "sh"), Map.entry("қ", "q"), Map.entry("ғ", "g'"), Map.entry("ў", "o'"),
            Map.entry("ҳ", "h"));

    private static final String[][] LATIN_DIGRAPHS = {
            {"sh", "ш"}, {"ch", "ч"}, {"ng", "нг"}, {"o'", "ў"}, {"g'", "ғ"}
    };

    private static final String[][] CYRILLIC_DIGRAPHS = {
            {"ш", "sh"}, {"ч", "ch"}, {"нг", "ng"}, {"ў", "o'"}, {"ғ", "g'"}
    };

    private SearchTransliteration() {
    }

    public static String latinToCyrillic(String text) {
        return convert(text, LATIN_DIGRAPHS, LATIN_TO_CYRILLIC);
    }

    public static String cyrillicToLatin(String text) {
        return convert(text, CYRILLIC_DIGRAPHS, CYRILLIC_TO_LATIN);
    }

    public static List<String> searchVariants(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        String trimmed = query.trim();
        Set<String> variants = new LinkedHashSet<>();
        variants.add(trimmed);
        String toCyr = latinToCyrillic(trimmed);
        String toLat = cyrillicToLatin(trimmed);
        if (!toCyr.equals(trimmed)) {
            variants.add(toCyr);
        }
        if (!toLat.equals(trimmed)) {
            variants.add(toLat);
        }
        return new ArrayList<>(variants);
    }

    private static String convert(String text, String[][] digraphs, Map<String, String> singleMap) {
        StringBuilder result = new StringBuilder();
        String lower = text.toLowerCase(Locale.ROOT);
        int i = 0;
        while (i < lower.length()) {
            boolean matched = false;
            for (String[] pair : digraphs) {
                String from = pair[0];
                if (lower.startsWith(from, i)) {
                    result.append(pair[1]);
                    i += from.length();
                    matched = true;
                    break;
                }
            }
            if (matched) {
                continue;
            }
            String ch = String.valueOf(lower.charAt(i));
            result.append(singleMap.getOrDefault(ch, String.valueOf(text.charAt(i))));
            i++;
        }
        return result.toString();
    }
}
