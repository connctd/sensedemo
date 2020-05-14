package api

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// predefined urls
var (
	BotModelURLOne = "https://w3id.org/bot#"
	BotModelURLTwo = "https://w3id.org/#"
)

// HandleSchemaCall will intercept any schema call
func HandleSchemaCall(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Schema call")

	requestedURL := r.URL.Query().Get("data")
	url, err := extractRequestedURL(requestedURL)
	if err != nil {
		fmt.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if url == BotModelURLOne || url == BotModelURLTwo {
		handleBotModelCall(w, r)
	} else {
		forwardRequest(url, w, r, map[string]string{})
	}
}

func handleBotModelCall(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Sending bot model")

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/ld+json")

	modelBytes, err := getBotModel()
	if err != nil {
		fmt.Println("Failed to encode bot model", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if _, err := w.Write(modelBytes); err != nil {
		fmt.Println("Failed to send reply", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func getBotModel() (json.RawMessage, error) {
	var model map[string]interface{}
	err := json.Unmarshal([]byte(botModel), &model)

	if err != nil {
		return []byte{}, err
	}

	return json.Marshal(model)
}

var botModel = `{
  "@context": {
    "bot": "https://w3id.org/bot#",
    "dbo": "http://dbpedia.org/ontology/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "dce": "http://purl.org/dc/elements/1.1/",
    "dcterms": "http://purl.org/dc/terms/",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "owl": "http://www.w3.org/2002/07/owl#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "schema": "http://schema.org/",
    "vann": "http://purl.org/vocab/vann/",
    "voaf": "http://purl.org/vocommons/voaf#",
    "vs": "http://www.w3.org/2003/06/sw-vocab-status/ns#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "hasBuilding": {
      "@id": "bot:hasBuilding"
    },
    "hasStorey": {
      "@id": "bot:hasStorey"
    },
    "hasSite": {
      "@id": "bot:hasSite"
    },
    "hasSpace": {
      "@id": "bot:hasSpace"
    },
    "hasElement": {
      "@id": "bot:hasElement"
    },
    "Site": {
      "@id": "bot:Site"
    },
    "Building": {
      "@id": "bot:Building"
    },
    "Storey": {
      "@id": "bot:Storey"
    },
    "Space": {
      "@id": "bot:Space"
    }
  },
  "@graph": [
    {
      "@id": "schema:domainIncludes",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "bot:hasStorey",
      "@type": "owl:ObjectProperty",
      "rdfs:comment": [
        {
          "@language": "nl",
          "@value": "Relatie tot de verdiepingen die zich in een zone bevinden. De typische domeinen van bot:hasStorey zijn instanties van bot:Building"
        },
        {
          "@language": "de",
          "@value": "Beziehung zwischen Geschossen, die in einer Zone enthalten sind. Oft ist die rdfs:domain eine Instanz von bot:Building."
        },
        {
          "@language": "da",
          "@value": "Relation til etager indeholdt i en zone. De typiske domæner for bot:hasStorey er forekomster af bot:Building."
        },
        {
          "@language": "fr",
          "@value": "Relation à définir entre les étages d'une même zone. Cette propriété s'applique typiquement sur des instances de bot:Building."
        },
        {
          "@language": "en",
          "@value": "Relation to storeys contained in a zone. The typical domains of bot:hasStorey are instances of bot:Building."
        }
      ],
      "rdfs:domain": {
        "@id": "bot:Zone"
      },
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "nl",
          "@value": "heeft verdieping"
        },
        {
          "@language": "en",
          "@value": "has storey"
        },
        {
          "@language": "da",
          "@value": "har etage"
        },
        {
          "@language": "de",
          "@value": "hat Geschoss"
        },
        {
          "@language": "es",
          "@value": "tiene piso"
        },
        {
          "@language": "sv",
          "@value": "har våning"
        },
        {
          "@language": "fr",
          "@value": "a étage"
        }
      ],
      "rdfs:range": {
        "@id": "bot:Storey"
      },
      "rdfs:subPropertyOf": {
        "@id": "bot:containsZone"
      },
      "schema:domainIncludes": {
        "@id": "bot:Building"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "vann:preferredNamespacePrefix",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "foaf:Person",
      "@type": "owl:Class"
    },
    {
      "@id": "bot:hasElement",
      "@type": "owl:ObjectProperty",
      "owl:propertyChainAxiom": {
        "@list": [
          {
            "@id": "bot:containsZone"
          },
          {
            "@id": "bot:hasElement"
          }
        ]
      },
      "rdfs:comment": [
        {
          "@language": "en",
          "@value": "Links a Zone to an Element that is either contained in or adjacent to, the Zone. The intended use of this relationship is not to be stated explicitly, but to be inferred from its sub-properties. It will, for example, allow one to query for all the doors of a building given that they have an adjacency to spaces of the building."
        },
        {
          "@language": "da",
          "@value": "Forbinder en Zone til en bygningsdel der enten er indeholdt i eller tilstødende til zonen. Det er ikke hensigten at denne relation angives eksplicit, men at den udledes af dennes underegneskaber. Det vil for eksempel tillade en forespørgsel på alle døre i en bygning givet at disse er enten tilstødende eller indeholdt i rum i bygningen."
        },
        {
          "@language": "de",
          "@value": "Beziehung zwischen einer Zone und einem Bauteil, dass entweder in der Zone enthalten ist, oder sich mit ihr schneidet. Diese Beziehung sollte nicht explizit benutzt werden, sondern ergibt sich implizit aus den Unterbeziehungen. Es ermöglicht, zum Beispiel, dass mit einer Abfrage alle Türen eines Gebäudes, die sich mit einer Zone schneiden ermittelt werden können."
        }
      ],
      "rdfs:domain": {
        "@id": "bot:Zone"
      },
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "nl",
          "@value": "heeft element"
        },
        {
          "@language": "sv",
          "@value": "värd för element"
        },
        {
          "@language": "de",
          "@value": "hat Bauteil"
        },
        {
          "@language": "nl",
          "@value": "hoster element"
        },
        {
          "@language": "en",
          "@value": "has element"
        },
        {
          "@language": "da",
          "@value": "har element"
        },
        {
          "@language": "fr",
          "@value": "a élément"
        },
        {
          "@language": "es",
          "@value": "alberga elemento"
        }
      ],
      "rdfs:range": {
        "@id": "bot:Element"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "bot:hasSimple3DModel",
      "@type": "owl:DatatypeProperty",
      "rdfs:comment": [
        {
          "@language": "de",
          "@value": "Verbindet jede bot:Zone oder bot:Element zu einem 3D Model, dass als Literal codiert ist."
        },
        {
          "@language": "da",
          "@value": "Forbinder enhver instans af bot:Zone eller bot:Element med en 3D-model beskrevet som en literal."
        },
        {
          "@language": "en",
          "@value": "Links any bot:Zone or bot:Element to a 3D Model encoded as a literal."
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "da",
          "@value": "har simpel 3D-model"
        },
        {
          "@language": "de",
          "@value": "hat einfaches 3D Modell"
        },
        {
          "@language": "en",
          "@value": "has Simple 3D Model"
        }
      ],
      "schema:domainIncludes": [
        {
          "@id": "bot:Zone"
        },
        {
          "@id": "bot:Element"
        }
      ],
      "vs:term_status": "unstable"
    },
    {
      "@id": "http://maxime-lefrancois.info/me#",
      "@type": "foaf:Person",
      "foaf:name": "Maxime Lefrançois"
    },
    {
      "@id": "schema:rangeIncludes",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "bot:Storey",
      "@type": "owl:Class",
      "owl:disjointWith": [
        {
          "@id": "bot:Building"
        },
        {
          "@id": "bot:Site"
        },
        {
          "@id": "bot:Space"
        }
      ],
      "rdfs:comment": [
        {
          "@language": "nl",
          "@value": "Een vlak gedeelte van een gebouw"
        },
        {
          "@language": "fr",
          "@value": "Correspond à un niveau du bâtiment"
        },
        {
          "@language": "es",
          "@value": "Un nivel de un edificio"
        },
        {
          "@language": "en",
          "@value": "A level part of a building"
        },
        {
          "@language": "nl",
          "@value": "Een horizontaal gedeelte van een gebouw"
        },
        {
          "@language": "de",
          "@value": "Die Gesamtheit aller Räume in einem Gebäude, die auf einer Zugangsebene liegen und horizontal verbunden sind"
        },
        {
          "@language": "sv",
          "@value": "Ett plan i en byggnad"
        },
        {
          "@language": "da",
          "@value": "Et plan i en bygning"
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "it",
          "@value": "Piano di edificio"
        },
        {
          "@language": "sv",
          "@value": "Våning"
        },
        {
          "@language": "fr",
          "@value": "Etage"
        },
        {
          "@language": "en",
          "@value": "Storey"
        },
        {
          "@language": "nl",
          "@value": "Verdieping"
        },
        {
          "@language": "es",
          "@value": "Piso"
        },
        {
          "@language": "de",
          "@value": "Geschoss (Architektur)"
        },
        {
          "@language": "da",
          "@value": "Etage"
        }
      ],
      "rdfs:subClassOf": {
        "@id": "bot:Zone"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "dcterms:modified",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "bot:hasBuilding",
      "@type": "owl:ObjectProperty",
      "rdfs:comment": [
        {
          "@language": "nl",
          "@value": "Relatie tot gebouwen die zich op een terrein bevinden"
        },
        {
          "@language": "fr",
          "@value": "Relation à définir entre les bâtiments d'une même zone. Cette propriété s'applique typiquement sur des instances de bot:Site."
        },
        {
          "@language": "en",
          "@value": "Relation to buildings contained in a zone. The typical domains of bot:hasBuilding are instances of bot:Site."
        },
        {
          "@language": "sv",
          "@value": "Relation till byggnader som inryms i en zon. Typiska domäner för bot:hasBuilding är förekomster av bot:Site."
        },
        {
          "@language": "da",
          "@value": "Relation til bygninger indeholdt i en zone. De typiske domæner for bot:hasBuilding er forekomster af bot:Site."
        },
        {
          "@language": "de",
          "@value": "Beziehung zwischen Gebäuden, die in einer Zone enthalten sind. Oft ist hier die rdfs:domain eine Instanz von bot:Site."
        }
      ],
      "rdfs:domain": {
        "@id": "bot:Zone"
      },
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "nl",
          "@value": "heeft gebouw"
        },
        {
          "@language": "de",
          "@value": "hat Gebäude"
        },
        {
          "@language": "da",
          "@value": "har bygning"
        },
        {
          "@language": "fr",
          "@value": "contient bâtiment"
        },
        {
          "@language": "es",
          "@value": "tiene edificio"
        },
        {
          "@language": "sv",
          "@value": "har byggnad"
        },
        {
          "@language": "en",
          "@value": "has building"
        }
      ],
      "rdfs:range": {
        "@id": "bot:Building"
      },
      "rdfs:subPropertyOf": {
        "@id": "bot:containsZone"
      },
      "schema:domainIncludes": {
        "@id": "bot:Site"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "bot:",
      "@type": [
        "owl:Ontology",
        "voaf:Vocabulary"
      ],
      "dcterms:contributor": "All contributing members of the W3C Linked Building Data Community Group",
      "dcterms:creator": [
        "Georg Ferdinand Schneider",
        "Pieter Pauwels",
        "Maxime Lefrançois",
        {
          "@id": "http://maxime-lefrancois.info/me#"
        },
        "Mads Holten Rasmussen",
        {
          "@id": "https://orcid.org/0000-0002-2033-859X"
        }
      ],
      "dcterms:description": {
        "@language": "en",
        "@value": "The Building Topology Ontology (BOT) is a simple ontology defining the core concepts of a building.\nIt is a simple, easy to extend ontology for the construction industry to document and exchange building data on the web.\n\nChanges since version 0.2.0 of the ontology are documented in:\n\nhttps://w3id.org/bot/bot.html#changes\n\nThe version 0.2.0 of the ontology is documented in:\n\nMads Holten Rasmussen, Pieter Pauwels, Maxime Lefrançois, Georg Ferdinand Schneider, Christian Anker Hviid and Jan Karlshøj (2017) Recent changes in the Building Topology Ontology, 5th Linked Data in Architecture and Construction Workshop (LDAC2017), November 13-15, 2017, Dijon, France, https://www.researchgate.net/publication/320631574_Recent_changes_in_the_Building_Topology_Ontology\n\nThe initial version 0.1.0 of the ontology was documented in:\n\nMads Holten Rasmussen, Pieter Pauwels, Christian Anker Hviid and Jan Karlshøj (2017) Proposing a Central AEC Ontology That Allows for Domain Specific Extensions, Lean and Computing in Construction Congress (LC3): Volume I – Proceedings of the Joint Conference on Computing in Construction (JC3), July 4-7, 2017, Heraklion, Greece, pp. 237-244 https://doi.org/10.24928/JC3-2017/0153"
      },
      "dcterms:issued": {
        "@type": "xsd:dateTime",
        "@value": "2018-06-21T12:00:00"
      },
      "dcterms:license": {
        "@id": "https://creativecommons.org/licenses/by/1.0/"
      },
      "dcterms:modified": {
        "@type": "xsd:dateTime",
        "@value": "2019-07-23T12:00:00"
      },
      "dcterms:title": {
        "@language": "en",
        "@value": "The Building Topology Ontology (BOT)"
      },
      "owl:priorVersion": {
        "@id": "https://w3id.org/bot/0.3.0"
      },
      "owl:versionIRI": {
        "@id": "https://w3id.org/bot/0.3.1"
      },
      "owl:versionInfo": "0.3.1",
      "rdfs:seeAlso": [
        {
          "@id": "https://www.researchgate.net/publication/320631574_Recent_changes_in_the_Building_Topology_Ontology"
        },
        {
          "@id": "https://doi.org/10.24928/JC3-2017/0153"
        }
      ],
      "vann:preferredNamespacePrefix": "bot",
      "vann:preferredNamespaceUri": {
        "@id": "bot:"
      }
    },
    {
      "@id": "bot:intersectsZone",
      "@type": [
        "owl:SymmetricProperty",
        "owl:ObjectProperty"
      ],
      "owl:propertyDisjointWith": {
        "@id": "bot:adjacentZone"
      },
      "rdfs:comment": [
        {
          "@language": "en",
          "@value": "Relationship between two zones whose 3D extent intersect. For example, a stairwell intersects different storeys."
        },
        {
          "@language": "de",
          "@value": "Beziehung zwischen zwei Zonen, die sich schneiden. Zum Beispiel schneidet eine Treppe verschiedene Geschosse."
        }
      ],
      "rdfs:domain": {
        "@id": "bot:Zone"
      },
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "en",
          "@value": "intersects zone"
        },
        {
          "@language": "de",
          "@value": "sich schneidende Zone"
        }
      ],
      "rdfs:range": {
        "@id": "bot:Zone"
      },
      "schema:domainIncludes": [
        {
          "@id": "bot:Storey"
        },
        {
          "@id": "bot:Building"
        },
        {
          "@id": "bot:Site"
        },
        {
          "@id": "bot:Space"
        }
      ],
      "schema:rangeIncludes": [
        {
          "@id": "bot:Site"
        },
        {
          "@id": "bot:Building"
        },
        {
          "@id": "bot:Space"
        },
        {
          "@id": "bot:Storey"
        }
      ],
      "vs:term_status": "stable"
    },
    {
      "@id": "bot:Interface",
      "@type": "owl:Class",
      "owl:disjointWith": [
        {
          "@id": "bot:Zone"
        },
        {
          "@id": "bot:Element"
        }
      ],
      "rdfs:comment": [
        {
          "@language": "en",
          "@value": "An interface is the surface where two building elements, two zones or a building element and a zone meet. It can be used for qualification of the connection between the two. A use case could be qualification of the heat transmission area between a zone and a wall covering several zones."
        },
        {
          "@language": "da",
          "@value": "En grænseflade er fladen hvor to bygningsdele, to zoner eller en bygningsdel og en zone mødes. Den kan benyttes til at kvalificere forbindelsen mellem de to. En use case kunne være kvalifikation af varmetransmissionsarealet mellem en zone og en væg som dækker flere zoner."
        },
        {
          "@language": "de",
          "@value": "Eine Grenzfläche ist die Fläche, an der sich zwei Bauteile, zwei Zonen oder ein Bauteil und eine Zone treffen. Das Konzept kann verwendet werden, um die Beziehung zwischen den Beteiligten zu qualifizieren. Ein Beispiel ist die Qualifizierung der Wärmeaustauschfläche zwischen eine Zone und einer Wand, die mehrere Zonen überdeckt."
        },
        {
          "@language": "nl",
          "@value": "Een interface is een vlak waar twee gebouwelementen, twee zones of een gebouw elementen en een zone elkaar raken. Het kan worden gebruikt om de verbinding tussen de twee te kwalificeren. Een use case kan de kwalificatie van het warmteoverbrengingsoppervlak tussen een zone en een muur over meerdere zones zijn."
        },
        {
          "@language": "fr",
          "@value": "Une interface correspond à la surface où se rencontrent a) deux éléments d'un bâtiment, b) deux zones ou  encore c) un élément d'un bâtiment avec une zone. Un cas d'utilisation type est constituée par la qualification de la zone de transmission de chaleur entre une zone et un mur couvrant plusieurs zones."
        },
        {
          "@language": "sv",
          "@value": "Ett gränssnitt är den yta där två byggdelar, två zoner eller en b yggdel och en zon möts. Det kan användas för att beskriva kopplingen mellan de två. Ett användningsfall kan vara att kvalificera värmetransmissionsarean mellan en zon och en vägg som täcker flera zoner."
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "en",
          "@value": "Interface"
        },
        {
          "@language": "da",
          "@value": "Grænseflade"
        },
        {
          "@language": "de",
          "@value": "Grenzfläche"
        },
        {
          "@language": "nl",
          "@value": "Interface"
        },
        {
          "@language": "fr",
          "@value": "Interface"
        },
        {
          "@language": "sv",
          "@value": "Gränssnitt"
        }
      ],
      "vs:term_status": "stable"
    },
    {
      "@id": "bot:containsElement",
      "@type": "owl:ObjectProperty",
      "owl:propertyChainAxiom": {
        "@list": [
          {
            "@id": "bot:containsZone"
          },
          {
            "@id": "bot:containsElement"
          }
        ]
      },
      "rdfs:comment": [
        {
          "@language": "es",
          "@value": "Relación a un elemento arquitectónico contenido en una zona."
        },
        {
          "@language": "da",
          "@value": "Relation til en bygningsdel, som er indeholdt i en zone."
        },
        {
          "@language": "en",
          "@value": "Relation to a building element contained in a zone."
        },
        {
          "@language": "nl",
          "@value": "Relatie tussen zone en een gebouwelement in die zone"
        },
        {
          "@language": "sv",
          "@value": "Relation till en byggdel som inryms i en zon."
        },
        {
          "@language": "fr",
          "@value": "Relation à définir entre un élément de bâti et la zone le contenant"
        },
        {
          "@language": "de",
          "@value": "Beziehung einer Zone zu einem Bauteil, dass es enthält."
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "en",
          "@value": "contains element"
        },
        {
          "@language": "da",
          "@value": "indeholder bygningsdel"
        },
        {
          "@language": "de",
          "@value": "enthält Bauteil"
        },
        {
          "@language": "es",
          "@value": "contiene elemento"
        },
        {
          "@language": "sv",
          "@value": "innehåller byggdel"
        },
        {
          "@language": "nl",
          "@value": "bevat element"
        },
        {
          "@language": "fr",
          "@value": "contient élément"
        }
      ],
      "rdfs:subPropertyOf": {
        "@id": "bot:hasElement"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "vann:preferredNamespaceUri",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "bot:adjacentElement",
      "@type": "owl:ObjectProperty",
      "owl:propertyDisjointWith": {
        "@id": "bot:intersectingElement"
      },
      "rdfs:comment": [
        {
          "@language": "fr",
          "@value": "Relation entre une zone et ses éléments adjacents, délimitant l'espace physique"
        },
        {
          "@language": "da",
          "@value": "Relation mellem en zone og dens tilstødende bygningsdele, som afgrænser det fysiske rum."
        },
        {
          "@language": "nl",
          "@value": "Relatie tussen een zone en zijn aangrenzende gebouwelementen, begrensd door fysieke ruimte."
        },
        {
          "@language": "sv",
          "@value": "Relation mellan en zon och dess angränsande byggdelar, som avgränsar det fysiska utrymmet."
        },
        {
          "@language": "de",
          "@value": "Beziehung zwischen einer Zone und dessen angrenzenden Bauteilen. Die Bauteile begrenzen die Zone."
        },
        {
          "@language": "en",
          "@value": "Relation between a zone and its adjacent building elements, bounding the zone."
        },
        {
          "@language": "es",
          "@value": "Relación entre una zona y sus elementos arquitectónicos adyacentes, que limitan el espacio físico."
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "sv",
          "@value": "angränsande element"
        },
        {
          "@language": "fr",
          "@value": "élément adjacent"
        },
        {
          "@language": "de",
          "@value": "benachbartes Bauteil"
        },
        {
          "@language": "es",
          "@value": "elemento adyacente"
        },
        {
          "@language": "da",
          "@value": "tilstødende element"
        },
        {
          "@language": "en",
          "@value": "adjacent element"
        },
        {
          "@language": "nl",
          "@value": "aangrenzend element"
        }
      ],
      "rdfs:subPropertyOf": {
        "@id": "bot:hasElement"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "voaf:Vocabulary",
      "@type": "owl:Class"
    },
    {
      "@id": "bot:has3DModel",
      "@type": "owl:ObjectProperty",
      "rdfs:comment": [
        {
          "@language": "de",
          "@value": "Verbindet eine Instanz von bot:Zone oder bot:Element zu einer IRI, die das zugehörige 3D Modell identifiziert. Das Modell kann in einem spezifischen RDF Vokabular kodiert sein. Andernfalls kann die IRI auch dereferenzierbar sein."
        },
        {
          "@language": "en",
          "@value": "Links any bot:Zone or bot:Element to a IRI that identifies its 3D Model. This 3D Model can then be described using some dedicated RDF vocabulary. Else, the 3D Model IRI could be dereferenceable, and when looking up the IRI one could retrieve a representation of the 3D Model with some existing data format for 3D models."
        },
        {
          "@language": "da",
          "@value": "Forbinder enhver instans af bot:Zone eller bot:Element med en IRI som identificerer dennes 3D-model. Denne 3D-model kan så beskrives ved brug af et dedikeret RDF-vokabular. Alternativt kan 3D-modellens IRI være dereferencerbar, sådan at der modtages en repræsentation af 3D-modellen i et eksisterende dataformat for 3D-modeller når IRIen slås op."
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "da",
          "@value": "har 3D-model"
        },
        {
          "@language": "en",
          "@value": "has 3D Model"
        },
        {
          "@language": "de",
          "@value": "hat 3D Modell"
        }
      ],
      "schema:domainIncludes": [
        {
          "@id": "bot:Element"
        },
        {
          "@id": "bot:Zone"
        }
      ],
      "vs:term_status": "unstable"
    },
    {
      "@id": "vs:term_status",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "dcterms:license",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "bot:hasSpace",
      "@type": "owl:ObjectProperty",
      "rdfs:comment": [
        {
          "@language": "es",
          "@value": "Relación a espacios contenidos en una zona. Los dominios típicos de bot:hasSPace son instancias de bot:Storey y bot:Building."
        },
        {
          "@language": "fr",
          "@value": "Relation à définir entre les pièces d'une même zone. Cette propriété s'applique typiquement sur des instances de bot:Building."
        },
        {
          "@language": "en",
          "@value": "Relation to spaces contained in a zone. The typical domains of bot:hasSpace are instances of bot:Storey and bot:Building."
        },
        {
          "@language": "de",
          "@value": "Beziehung von Räumen, die sich in einer Zone befinden. Oft ist die rdfs:domain eine Instanz von bot:Storey oder bot:Building."
        },
        {
          "@language": "nl",
          "@value": "Relatie tot ruimtes die zich in een zone bevinden. De typische domeinen van bot:hasSpace zijn instanties van bot:Storey en bot:Building."
        },
        {
          "@language": "da",
          "@value": "Relation til rum indeholdt i en zone. De typiske domæner for bot:hasSpace er forekomster af bot:Storey og bot:Building."
        },
        {
          "@language": "sv",
          "@value": "Relation till rum som inryms i en zon. Typiska domäner för bot:hasSpace är förekomster av bot:Storey och bot:Building."
        }
      ],
      "rdfs:domain": {
        "@id": "bot:Zone"
      },
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "en",
          "@value": "has space"
        },
        {
          "@language": "de",
          "@value": "hat Raum"
        },
        {
          "@language": "es",
          "@value": "tiene espacio"
        },
        {
          "@language": "da",
          "@value": "har rum"
        },
        {
          "@language": "sv",
          "@value": "har rum"
        },
        {
          "@language": "nl",
          "@value": "heeft ruimte"
        },
        {
          "@language": "fr",
          "@value": "contient pièce"
        }
      ],
      "rdfs:range": {
        "@id": "bot:Space"
      },
      "rdfs:subPropertyOf": {
        "@id": "bot:containsZone"
      },
      "schema:domainIncludes": {
        "@id": "bot:Storey"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "foaf:name",
      "@type": "owl:DatatypeProperty"
    },
    {
      "@id": "bot:Site",
      "@type": "owl:Class",
      "owl:disjointWith": [
        {
          "@id": "bot:Storey"
        },
        {
          "@id": "bot:Space"
        },
        {
          "@id": "bot:Building"
        }
      ],
      "rdfs:comment": [
        {
          "@language": "es",
          "@value": "Área que contiene uno o más edificios."
        },
        {
          "@language": "da",
          "@value": "Område som indeholder en eller flere bygninger."
        },
        {
          "@language": "de",
          "@value": "Abgegrenzter Teil der Erdoberfläche auf dem ein oder mehrere Gebäude stehen."
        },
        {
          "@language": "sv",
          "@value": "En plats som rymmer en eller flera byggnader."
        },
        {
          "@language": "en",
          "@value": "Area containing one or more buildings."
        },
        {
          "@language": "nl",
          "@value": "Omgeving die één of meerdere gebouwen bevat."
        },
        {
          "@language": "fr",
          "@value": "Un site comprend un ou plusieurs bâtiments"
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "fr",
          "@value": "Site"
        },
        {
          "@language": "da",
          "@value": "Grund"
        },
        {
          "@language": "sv",
          "@value": "Plats"
        },
        {
          "@language": "en",
          "@value": "Site"
        },
        {
          "@language": "es",
          "@value": "Sitio"
        },
        {
          "@language": "de",
          "@value": "Grundstück"
        },
        {
          "@language": "nl",
          "@value": "Terrein"
        }
      ],
      "rdfs:subClassOf": {
        "@id": "bot:Zone"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "bot:Element",
      "@type": "owl:Class",
      "owl:disjointWith": [
        {
          "@id": "bot:Zone"
        },
        {
          "@id": "bot:Interface"
        }
      ],
      "rdfs:comment": [
        {
          "@language": "da",
          "@value": "Bestanddel af et bygværk med en karakteristisk funktion, form eller position [12006-2, 3.4.7]"
        },
        {
          "@language": "nl",
          "@value": "Bestanddeel van een gebouwde entiteit met een karakteristieke technische functie, vorm of positie [12006-2, 3.4.7]"
        },
        {
          "@language": "de",
          "@value": "Das Bauteil ist im Bauwesen ein einzelnes Teil, ein Element oder eine Komponente, aus denen ein Bauwerk zusammengesetzt wird [12006-2, 3.4.7]"
        },
        {
          "@language": "fr",
          "@value": "Constituant d'un bâtiment remplissant une fonction technique spécifique ou ayant une forme ou une position spécifiques"
        },
        {
          "@language": "sv",
          "@value": "Beståndsdel av ett byggnadsverk med en karaktäristisk teknisk funktion, form eller position [12006-2, 3.4.7]"
        },
        {
          "@language": "en",
          "@value": "Constituent of a construction entity with a characteristic technical function, form or position [12006-2, 3.4.7]"
        },
        {
          "@language": "es",
          "@value": "Componente de una construcción con una función técnica, forma o posición característica"
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "it",
          "@value": "Elemento architettonico"
        },
        {
          "@language": "da",
          "@value": "Bygningsdel"
        },
        {
          "@language": "en",
          "@value": "Building element"
        },
        {
          "@language": "fr",
          "@value": "Elément d'un bâtiment"
        },
        {
          "@language": "nl",
          "@value": "Gebouwelement"
        },
        {
          "@language": "es",
          "@value": "Elemento arquitectónico"
        },
        {
          "@language": "sv",
          "@value": "Byggdel"
        },
        {
          "@language": "de",
          "@value": "Bauteil (Bauwesen)"
        }
      ],
      "vs:term_status": "stable"
    },
    {
      "@id": "dcterms:description",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "bot:hasZeroPoint",
      "@type": "owl:ObjectProperty",
      "rdfs:comment": [
        {
          "@language": "de",
          "@value": "Verbindet eine Instanz von bot:Site mit einem wgs84:Point, der den Längen- und Breitengrad des Nullpunkts des Grundstücks definiert."
        },
        {
          "@language": "da",
          "@value": "Forbinder et bot:Site med et wgs84:Point som beskriver længde- og breddegrad for projektets nulpunkt"
        },
        {
          "@language": "en",
          "@value": "Links a bot:Site to a wgs84:Point that encodes the latitude and longitude of the Zero Point of the building site."
        }
      ],
      "rdfs:domain": {
        "@id": "bot:Site"
      },
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "en",
          "@value": "has zero point"
        },
        {
          "@language": "de",
          "@value": "hat Nullpunkt"
        },
        {
          "@language": "da",
          "@value": "har nulpunkt"
        }
      ],
      "vs:term_status": "unstable"
    },
    {
      "@id": "bot:Space",
      "@type": "owl:Class",
      "owl:disjointWith": [
        {
          "@id": "bot:Storey"
        },
        {
          "@id": "bot:Building"
        },
        {
          "@id": "bot:Site"
        }
      ],
      "rdfs:comment": [
        {
          "@language": "nl",
          "@value": "Een afgebakende driedimensionale omgeving die fysiek of indirect gedefinieerd wordt [ISO 12006-2 (DIS 2013), 3.4.3]"
        },
        {
          "@language": "es",
          "@value": "Una extensión tridimensional limitada y definida fisica o teóricamente"
        },
        {
          "@language": "de",
          "@value": "Fläche oder Volumen mit tatsächlicher oder theoretischer Begrenzung [ISO 6707-1:2014]"
        },
        {
          "@language": "en",
          "@value": "A limited three-dimensional extent defined physically or notionally [ISO 12006-2 (DIS 2013), 3.4.3]"
        },
        {
          "@language": "da",
          "@value": "En afgrænset tredimensionel udstrækning defineret fysisk eller fiktivt"
        },
        {
          "@language": "fr",
          "@value": "Une extension 3D bornée, définie d'un point de vue physique ou théorique [ISO 12006-2 (DIS 2013), 3.4.3]"
        },
        {
          "@language": "sv",
          "@value": "En avgränsad tredimensionell utsträckning som definierats fysiskt eller fiktivt [ISO 12006-2 (DIS 2013), 3.4.3]"
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "da",
          "@value": "Rum"
        },
        {
          "@language": "nl",
          "@value": "Ruimte"
        },
        {
          "@language": "de",
          "@value": "Raum"
        },
        {
          "@language": "sv",
          "@value": "Utrymme"
        },
        {
          "@language": "fr",
          "@value": "Pièce"
        },
        {
          "@language": "es",
          "@value": "Espacio"
        },
        {
          "@language": "en",
          "@value": "Space"
        },
        {
          "@language": "it",
          "@value": "Spazio"
        }
      ],
      "rdfs:subClassOf": {
        "@id": "bot:Zone"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "bot:adjacentZone",
      "@type": [
        "owl:SymmetricProperty",
        "owl:ObjectProperty"
      ],
      "owl:propertyDisjointWith": {
        "@id": "bot:intersectsZone"
      },
      "rdfs:comment": [
        {
          "@language": "nl",
          "@value": "Relatie tussen twee zones die een interface delen"
        },
        {
          "@language": "de",
          "@value": "Beziehung zwischen zwei Zonen die eine gemeinsame Grenzfläche haben, aber sich nicht schneiden."
        },
        {
          "@language": "sv",
          "@value": "Relation mellan två zoner som delar ett gemensamt gränssnitt."
        },
        {
          "@language": "en",
          "@value": "Relationship between two zones that share a common interface, but do not intersect."
        },
        {
          "@language": "da",
          "@value": "Relation mellem to zoner, der deler en fælles grænseflade."
        },
        {
          "@language": "fr",
          "@value": "Relation entre deux zones partageant une interface commune, sans intersection"
        }
      ],
      "rdfs:domain": {
        "@id": "bot:Zone"
      },
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "fr",
          "@value": "zone adjacente"
        },
        {
          "@language": "de",
          "@value": "angrenzende Zone"
        },
        {
          "@language": "sv",
          "@value": "angränsande zon"
        },
        {
          "@language": "nl",
          "@value": "aangrenzende zone"
        },
        {
          "@language": "es",
          "@value": "zona adyacente"
        },
        {
          "@language": "en",
          "@value": "adjacent zone"
        },
        {
          "@language": "da",
          "@value": "tilstødende zone"
        }
      ],
      "rdfs:range": {
        "@id": "bot:Zone"
      },
      "schema:domainIncludes": [
        {
          "@id": "bot:Space"
        },
        {
          "@id": "bot:Storey"
        },
        {
          "@id": "bot:Site"
        },
        {
          "@id": "bot:Building"
        }
      ],
      "schema:rangeIncludes": [
        {
          "@id": "bot:Space"
        },
        {
          "@id": "bot:Site"
        },
        {
          "@id": "bot:Storey"
        },
        {
          "@id": "bot:Building"
        }
      ],
      "vs:term_status": "stable"
    },
    {
      "@id": "bot:intersectingElement",
      "@type": "owl:ObjectProperty",
      "owl:propertyDisjointWith": {
        "@id": "bot:adjacentElement"
      },
      "rdfs:comment": [
        {
          "@language": "de",
          "@value": "Beziehung zwischen einer Zone und einem Bauteil, das die Zone schneidet."
        },
        {
          "@language": "en",
          "@value": "Relation between a Zone and a building Element that intersects it. "
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "fr",
          "@value": "élément intersectant"
        },
        {
          "@language": "de",
          "@value": "schneidendes Bauteil"
        },
        {
          "@language": "en",
          "@value": "intersecting element"
        }
      ],
      "rdfs:subPropertyOf": {
        "@id": "bot:hasElement"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "dcterms:issued",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "bot:Zone",
      "@type": "owl:Class",
      "owl:disjointWith": [
        {
          "@id": "bot:Interface"
        },
        {
          "@id": "bot:Element"
        }
      ],
      "rdfs:comment": [
        {
          "@language": "en",
          "@value": "A spatial 3D division. Sub-classes of bot:Zones include bot:Site, bot:Building, bot:Storey, or bot:Space. An instance of bot:Zone can contain other bot:Zone instances, making it possible to group or subdivide zones. An instance of bot:Zone can be adjacent to other bot:Zone instances. Finally, a bot:Zone can instantiate two relations to bot:Element, which are either contained in (bot:containsElement), or adjacent to it (bot:adjacentElement)."
        },
        {
          "@language": "de",
          "@value": "Ein abstraktes Konzept für eine räumliche, dreidimensionale Einteilung eines Raums. Spezialisierungen von bot:Zone sind bot:Site, bot:Building, bot:Storey oder bot:Space. Eine Instanz von bot:Zone kannn andere Instanzen von bot:Zone enthalten. So ist es möglich Instanzen von bot:Zone zu gruppieren, oder zu unterteilen. Eine Instanz einer bot:Zone kann an eine andere Instanz von bot:Zone angrenzen. Es bestehen zwei Möglichkeiten Instanzen von bot:Zone und bot:Element in Beziehung zu setzen. Entweder ein Element ist in einer Zone enthalten (bot:containsElement) oder es grenzt an eine andere Zone an (bot:adjacentElement)."
        },
        {
          "@language": "nl",
          "@value": "Een gebied of stuk land dat een dat een bepaalde karakteristiek of bestemming heeft, ergens voor gebruikt wordt of waar bepaalde restricties gelden. Een bot:Zone kan andere bot:Zones bevatten gedefinieerd door de relatie bot:containsZone, en kan verbonden zijn met andere bot:Zones gedefinieerd door de relatie bot:adjacentZone."
        },
        {
          "@language": "da",
          "@value": "En rummelig 3D-inddeling. Underklasser af bot:Zone inkluderer bot:Site, bot:Building, bot:Storey eller bot:Space. En bot:Zone forekomst kan indeholde andre bot:Zone forekomster, hvilket gør det muligt at gruppere eller underinddele zoner. En forekomst af bot:Zone kan være tilstødende til andre bot:Zone forekomster. Endelig kan en bot:Zone instantiere to relationer til et bot:Element, hvilke er enten indeholdt i (bot:containsElement) eller tilstødende dertil (bot:adjacentElement)."
        },
        {
          "@language": "sv",
          "@value": "En area eller ett stycke land som har en specifik karaktäristik, syfte, användning eller är förmål för specifika restriktioner. En bot:Zone kan innehålla andra bot:Zoner genom relationen bot:containsZone, och den kan kopplas till andra bot:Zoner genom relationen bot:adjacentZone."
        },
        {
          "@language": "fr",
          "@value": "Une zone ou une étendue de terrain avec des caractéristiques et usages spécifiques, ou pouvant être sujette à des restrictions spécifiques. Un élément bot:Zone peut contenir d'autres éléments bot:Zone comme défini par la relation bot:containsZone. La connection entre plusieurs éléments bot:Zone est définie en utilisant la propriété bot:adjacentZone."
        },
        {
          "@language": "es",
          "@value": "Una área o espacio de tierra que tiene una característica, propósito o uso particular, o que está sujeto a restricciones particulares. Un bot:Zone puede contener otros bot:Zones definidos mediante la relación bot:containsZone, y puede estar conectado con otros bot:Zones mediante la relación bot:adjacentZone."
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "fr",
          "@value": "Zone"
        },
        {
          "@language": "nl",
          "@value": "Zone"
        },
        {
          "@language": "es",
          "@value": "Zona"
        },
        {
          "@language": "de",
          "@value": "Zone"
        },
        {
          "@language": "sv",
          "@value": "Zon"
        },
        {
          "@language": "en",
          "@value": "Zone"
        },
        {
          "@language": "da",
          "@value": "Zone"
        }
      ],
      "vs:term_status": "stable"
    },
    {
      "@id": "https://orcid.org/0000-0002-2033-859X",
      "@type": "foaf:Person",
      "foaf:name": "Georg Ferdinand Schneider"
    },
    {
      "@id": "dcterms:title",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "dcterms:contributor",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "dcterms:creator",
      "@type": "owl:AnnotationProperty"
    },
    {
      "@id": "bot:hasSubElement",
      "@type": "owl:ObjectProperty",
      "rdfs:comment": [
        {
          "@language": "sv",
          "@value": "Relation mellan en byggdel a) och en annan byggdel b) som utgör värd a). Exempel: inst:wall bot:hasSubElement inst:window"
        },
        {
          "@language": "nl",
          "@value": "Relatie tussen een gebouwelement a) en een ander element b) dat een ander element in zich heeft a). Voorbeeld: inst:wall bot:hasSubElement inst:window"
        },
        {
          "@language": "fr",
          "@value": "Relation entre un élément du bâti A et un autre élément du bâti, B, contenu ou abrité dans A"
        },
        {
          "@language": "de",
          "@value": "Beziehung zwischen einem Bauteil und a) einem anderen Bauteil oder b) einem Bauteil, dass ein anderes Bauteil enthält."
        },
        {
          "@language": "da",
          "@value": "Relation mellem en bygningsdel a) og en anden bygningsdel b) hostet af element a). Eksempel: inst:wall bot:hasSubElement inst:window"
        },
        {
          "@language": "en",
          "@value": "Relation between an element a) and another element b) hosted by element a)"
        }
      ],
      "rdfs:domain": {
        "@id": "bot:Element"
      },
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "de",
          "@value": "hat Unterbauteil"
        },
        {
          "@language": "fr",
          "@value": "a sous-élément"
        },
        {
          "@language": "sv",
          "@value": "värd för sub element"
        },
        {
          "@language": "nl",
          "@value": "heeft sub element"
        },
        {
          "@language": "nl",
          "@value": "hoster sub element"
        },
        {
          "@language": "en",
          "@value": "has sub-element"
        },
        {
          "@language": "da",
          "@value": "hoster sub element"
        },
        {
          "@language": "es",
          "@value": "alberga sub elemento"
        }
      ],
      "rdfs:range": {
        "@id": "bot:Element"
      },
      "vs:term_status": "stable"
    },
    {
      "@id": "bot:interfaceOf",
      "@type": "owl:ObjectProperty",
      "rdfs:comment": [
        {
          "@language": "sv",
          "@value": "Relation mellan ett gränssnitt och en angränsande zon eller byggdel."
        },
        {
          "@language": "da",
          "@value": "Relation mellem en grænseflade og en tilstødende zone eller bygningsdel."
        },
        {
          "@language": "nl",
          "@value": "Relatie tussen een interface en een aanliggende zone of element."
        },
        {
          "@language": "en",
          "@value": "Relationship between an interface and an adjacent zone or element."
        },
        {
          "@language": "de",
          "@value": "Beziehung zwischen einer Grenzfläche und einer angrenzenden Zone oder einem Bauteil."
        },
        {
          "@language": "fr",
          "@value": "Relation à définir entre une interface et une zone ou un élément adjacents."
        }
      ],
      "rdfs:domain": {
        "@id": "bot:Interface"
      },
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "de",
          "@value": "Grenzfläche von"
        },
        {
          "@language": "en",
          "@value": "interface of"
        },
        {
          "@language": "nl",
          "@value": "interface van"
        },
        {
          "@language": "da",
          "@value": "grænseflade for"
        },
        {
          "@language": "sv",
          "@value": "gränssnitt för"
        },
        {
          "@language": "fr",
          "@value": "interface de"
        }
      ],
      "vs:term_status": "stable"
    },
    {
      "@id": "bot:containsZone",
      "@type": [
        "owl:ObjectProperty",
        "owl:TransitiveProperty"
      ],
      "rdfs:comment": [
        {
          "@language": "da",
          "@value": "Relation til underzoner i en større zone. En rum-zone kan for eksempel være indeholdt i en etage-zone som ydermere er indeholdt i en bygnings-zone. bot:containsZone er en transitiv egenskab, hvilket betyder at rum-zonen i det forrige eksempel også er indeholdt i bygnings-zonen."
        },
        {
          "@language": "de",
          "@value": "Beziehung zwischen Zonen, wobei eine die andere enthält. Zum Beispiel kann eine Raumzone in einer Geschossszone enthalten sein, die wiederrum in einer Gebäudezone enthalten ist. bot:containsZone is eine transitive Beziehung, dass heisst zwischen der Raumzone im vorherigen Beispiel und der Gebäudezone besteht auch die Beziehung bot:containsZone."
        },
        {
          "@language": "fr",
          "@value": "Relation entre les sous-zones composant une zone plus grande. Cette propriété est transitive."
        },
        {
          "@language": "sv",
          "@value": "Relation till delzoner i en huvudzon. En rumszon kan till exempel inrymmas i en våningszon som i sin tur inryms i en byggnadszon. bot:containsZone är en transitiv relation vilket i exemplet betyder att rumszonen också inryms i byggnadszonen."
        },
        {
          "@language": "nl",
          "@value": "Relatie tussen subzones van een hoofd zone. Een ruimtezone kan bijvoorbeeld worden bevat door een verdiepingszone, die wederom bevat wordt door een gebouwzone. bot:containsZone is een transitieve eigenschap, wat betekent dat in het vorige voorbeeld de ruimtezone ook bevat wordt door de gebouwzone."
        },
        {
          "@language": "en",
          "@value": "Relationship to the subzones of a major zone. A space zone could for instance be contained in a storey zone which is further contained in a building zone. bot:containsZone is a transitive property. This implies that in the previous example a bot:containsZone relationship holds between the space zone and the building zone."
        }
      ],
      "rdfs:domain": {
        "@id": "bot:Zone"
      },
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "da",
          "@value": "indeholder zone"
        },
        {
          "@language": "de",
          "@value": "enthält Zone"
        },
        {
          "@language": "en",
          "@value": "contains zone"
        },
        {
          "@language": "es",
          "@value": "contiene zona"
        },
        {
          "@language": "fr",
          "@value": "contient zone"
        },
        {
          "@language": "nl",
          "@value": "bevat zone"
        },
        {
          "@language": "sv",
          "@value": "innehåller zon"
        }
      ],
      "rdfs:range": {
        "@id": "bot:Zone"
      },
      "schema:domainIncludes": [
        {
          "@id": "bot:Storey"
        },
        {
          "@id": "bot:Space"
        },
        {
          "@id": "bot:Site"
        },
        {
          "@id": "bot:Building"
        }
      ],
      "schema:rangeIncludes": [
        {
          "@id": "bot:Storey"
        },
        {
          "@id": "bot:Building"
        },
        {
          "@id": "bot:Site"
        },
        {
          "@id": "bot:Space"
        }
      ],
      "vs:term_status": "stable"
    },
    {
      "@id": "bot:Building",
      "@type": "owl:Class",
      "owl:disjointWith": [
        {
          "@id": "bot:Space"
        },
        {
          "@id": "bot:Site"
        },
        {
          "@id": "bot:Storey"
        }
      ],
      "rdfs:comment": [
        {
          "@language": "es",
          "@value": "Una unidad de entorno construido intependiente con una estructura espacial característica, para proporcionar al menos una función o actividad de usuario"
        },
        {
          "@language": "de",
          "@value": "Bauwerk hauptsächlich zum Zweck des Schutzes für seine Bewohner und die darin aufbewahrten Gegenstände; im Allgemeinen teilweise oder ganz geschlossen und ortsfest [ISO 6707-1:2014]"
        },
        {
          "@language": "da",
          "@value": "En uafhængig del af det byggede miljø med en karakteristisk rumlig struktur, der understøtter mindst én funktion eller brugeraktivitet"
        },
        {
          "@language": "en",
          "@value": "An independent unit of the built environment with a characteristic spatial structure, intended to serve at least one function or user activity [ISO 12006-2:2013]"
        },
        {
          "@language": "fr",
          "@value": "Une unité indépendante de l'environnement bâti avec une structure spatiale caractéristique, conçue pour répondre à une fonction ou une activité de l'utilisateur [ISO 12006-2:2013]"
        },
        {
          "@language": "sv",
          "@value": "En oberoende enhet i den byggda miljön med en karaktäristisk rumslig struktur som stödjer minst en funktion eller användaraktivitet.  [ISO 12006-2:2013]"
        },
        {
          "@language": "nl",
          "@value": "Een onafhankelijke entiteit met een ruimtelijke structuur die onderdeel is van de gebouwde omgeving, en bedoeld is om minimaal één functie of gebruikersactiviteit te bedienen [ISO 12006-2:2013]."
        }
      ],
      "rdfs:isDefinedBy": {
        "@id": "bot:"
      },
      "rdfs:label": [
        {
          "@language": "it",
          "@value": "Edificio"
        },
        {
          "@language": "de",
          "@value": "Gebäude"
        },
        {
          "@language": "nl",
          "@value": "Gebouw"
        },
        {
          "@language": "en",
          "@value": "Building"
        },
        {
          "@language": "da",
          "@value": "Bygning"
        },
        {
          "@language": "sv",
          "@value": "Byggnad"
        },
        {
          "@language": "fr",
          "@value": "Bâtiment"
        },
        {
          "@language": "es",
          "@value": "Edificio"
        }
      ],
      "rdfs:subClassOf": {
        "@id": "bot:Zone"
      },
      "vs:term_status": "stable"
    }
  ]
}`
