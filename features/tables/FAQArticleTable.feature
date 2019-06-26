Feature: Als Nutzer möchte ich eine korrekte Standardkonfiguration für eine Tabelle erhalten

    Scenario Outline: Tabelle mit korrekter Konfiguration erstellen
        Given Tabelle: <objectType>
        Then Selection: <selection>
        Then Toggle: <toggle>
        Then Kopfzeilengröße: <headerHeight>
        Then Zeilengröße: <rowHeight>
        Then DisplayLimit: <displayLimit>
        Examples:
            | selection | toggle | objectType   | headerHeight | rowHeight | displayLimit |
            | 1         | 0      | 'FAQArticle' | 'l'          | 's'       | 10           |

    Scenario Outline: Tabelle mit korrekter Spalte <column>
        Given Tabelle: <objectType>
        Then Die Spalte <column> muss sortierbar sein: <sortable>
        Then Die Spalte <column> muss filterbar sein: <filterable>
        Then Die Spalte <column> hat einen diskreten Filter: <listFilter>
        Then Die Spalte <column> muss <width> breit sein
        Then Die Spalte <column> hat eine flexible Breite: <flexible>
        Then Die Spalte <column> zeigt Text an: <showText>
        Then Die Spalte <column> zeigt Icon an: <showIcon>
        Then Die Spalte <column> ist vom Typ: <type>
        Then Die Spalte <column> zeigt Spaltenbezeichnung an: <columnTitle>
        Then Die Spalte <column> zeigt Spaltenicon an: <columnIcon>
        Examples:
            | column       | sortable | filterable | listFilter | width | flexible | showText | showIcon | type       | columnTitle | columnIcon | objectType   |
            | 'Number'     | 1        | 1          | 0          | 120   | 1        | 1        | 0        | 'STRING'   | 1           | 0          | 'FAQArticle' |
            | 'Title'      | 1        | 1          | 0          | 300   | 1        | 1        | 0        | 'STRING'   | 1           | 0          | 'FAQArticle' |
            | 'Language'   | 1        | 1          | 1          | 125   | 1        | 1        | 0        | 'STRING'   | 1           | 0          | 'FAQArticle' |
            | 'Visibility' | 1        | 1          | 1          | 125   | 0        | 1        | 1        | 'STRING'   | 1           | 0          | 'FAQArticle' |
            | 'Votes'      | 1        | 1          | 1          | 120   | 0        | 1        | 1        | 'STRING'   | 1           | 0          | 'FAQArticle' |
            | 'CategoryID' | 1        | 1          | 1          | 125   | 1        | 1        | 0        | 'STRING'   | 1           | 0          | 'FAQArticle' |
            | 'Changed'    | 1        | 1          | 0          | 125   | 1        | 1        | 0        | 'DATETIME' | 1           | 0          | 'FAQArticle' |
            | 'ChangedBy'  | 1        | 1          | 0          | 150   | 1        | 1        | 0        | 'STRING'   | 1           | 0          | 'FAQArticle' |

    Scenario Outline: Tabelle - Schmal mit korrekter Spalte <column>
        Given Tabelle - Schmal: <objectType>
        Then Die Spalte <column> muss sortierbar sein: <sortable>
        Then Die Spalte <column> muss filterbar sein: <filterable>
        Then Die Spalte <column> hat einen diskreten Filter: <listFilter>
        Then Die Spalte <column> muss <width> breit sein
        Then Die Spalte <column> hat eine flexible Breite: <flexible>
        Then Die Spalte <column> zeigt Text an: <showText>
        Then Die Spalte <column> zeigt Icon an: <showIcon>
        Then Die Spalte <column> ist vom Typ: <type>
        Then Die Spalte <column> zeigt Spaltenbezeichnung an: <columnTitle>
        Then Die Spalte <column> zeigt Spaltenicon an: <columnIcon>
        Examples:
            | column       | sortable | filterable | listFilter | width | flexible | showText | showIcon | type     | columnTitle | columnIcon | objectType   |
            | 'Number'     | 1        | 1          | 0          | 120   | 1        | 1        | 0        | 'STRING' | 1           | 0          | 'FAQArticle' |
            | 'Title'      | 1        | 1          | 0          | 300   | 1        | 1        | 0        | 'STRING' | 1           | 0          | 'FAQArticle' |
            | 'Language'   | 1        | 1          | 1          | 125   | 1        | 1        | 0        | 'STRING' | 1           | 0          | 'FAQArticle' |
            | 'Visibility' | 1        | 1          | 1          | 125   | 0        | 1        | 1        | 'STRING' | 1           | 0          | 'FAQArticle' |
            | 'Votes'      | 1        | 1          | 1          | 120   | 0        | 1        | 1        | 'STRING' | 1           | 0          | 'FAQArticle' |
            | 'CategoryID' | 1        | 1          | 1          | 125   | 1        | 1        | 0        | 'STRING' | 1           | 0          | 'FAQArticle' |