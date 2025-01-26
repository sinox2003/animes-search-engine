package org.projet.searchengineforanimeapi.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "characters")
public class Character {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String character_img;
    private String character_name;
    private String character_role;
    private String voice_actor_name;
    private String voice_actor_nationality;
    private String voice_actor_img;
}
